import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useEffect } from "react";

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface Conversation {
  match_id: string;
  other_user: {
    user_id: string;
    display_name: string;
    photo_url: string | null;
  };
  last_message: Message | null;
  unread_count: number;
  matched_at: string;
}

export const useConversations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
          queryClient.invalidateQueries({ queryKey: ["messages"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get all matches
      const { data: matches, error } = await supabase
        .from("matches")
        .select("*")
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .eq("is_active", true)
        .order("last_message_at", { ascending: false, nullsFirst: false });

      if (error) throw error;

      // Get last message and unread count for each match
      const conversations: Conversation[] = await Promise.all(
        (matches || []).map(async (match: any) => {
          const otherUserId = match.user_a_id === user.id ? match.user_b_id : match.user_a_id;

          // Get other user's profile
          const { data: otherProfile } = await supabase
            .from("profiles")
            .select("user_id, display_name")
            .eq("user_id", otherUserId)
            .single();

          // Get primary photo
          const { data: photos } = await supabase
            .from("user_photos")
            .select("photo_url, is_primary")
            .eq("user_id", otherUserId)
            .order("display_order", { ascending: true })
            .limit(1);

          // Get last message
          const { data: lastMessage } = await supabase
            .from("messages")
            .select("*")
            .eq("match_id", match.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          // Get unread count
          const { count: unreadCount } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("match_id", match.id)
            .neq("sender_id", user.id)
            .eq("is_read", false);

          return {
            match_id: match.id,
            other_user: {
              user_id: (otherProfile as any)?.user_id || "",
              display_name: (otherProfile as any)?.display_name || "Unknown",
              photo_url: photos?.[0]?.photo_url || null,
            },
            last_message: lastMessage as Message | null,
            unread_count: unreadCount || 0,
            matched_at: match.matched_at,
          };
        })
      );

      // Sort by last message time, then by match time
      return conversations.sort((a, b) => {
        const aTime = a.last_message?.created_at || a.matched_at;
        const bTime = b.last_message?.created_at || b.matched_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
    },
    enabled: !!user,
  });
};

export const useMessages = (matchId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up realtime subscription for this match
  useEffect(() => {
    if (!user || !matchId) return;

    const channel = supabase
      .channel(`messages-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["messages", matchId] });
          
          // Mark message as read if it's from the other user
          if ((payload.new as any).sender_id !== user.id) {
            supabase
              .from("messages")
              .update({ is_read: true, read_at: new Date().toISOString() } as any)
              .eq("id", (payload.new as any).id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, matchId, queryClient]);

  return useQuery({
    queryKey: ["messages", matchId],
    queryFn: async () => {
      if (!user || !matchId) return [];

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Mark unread messages as read
      const unreadMessages = (data || []).filter((m: any) => !m.is_read && m.sender_id !== user.id);
      if (unreadMessages.length > 0) {
        await supabase
          .from("messages")
          .update({ is_read: true, read_at: new Date().toISOString() } as any)
          .in("id", unreadMessages.map((m: any) => m.id));
      }

      return data as Message[];
    },
    enabled: !!user && !!matchId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ matchId, content }: { matchId: string; content: string }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("messages")
        .insert({
          match_id: matchId,
          sender_id: user.id,
          content,
        } as any)
        .select()
        .single();

      if (error) throw error;

      // Update last_message_at on match
      await supabase
        .from("matches")
        .update({ last_message_at: new Date().toISOString() } as any)
        .eq("id", matchId);

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.matchId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
