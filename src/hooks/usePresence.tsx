import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useQueryClient } from "@tanstack/react-query";

interface UserPresence {
  user_id: string;
  is_online: boolean;
  last_seen: string;
}

export const usePresence = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Update user's last_active_at periodically
  useEffect(() => {
    if (!user) return;

    const updatePresence = async () => {
      await supabase
        .from("profiles")
        .update({ last_active_at: new Date().toISOString() } as any)
        .eq("user_id", user.id);
    };

    // Update immediately
    updatePresence();

    // Update every 30 seconds
    const interval = setInterval(updatePresence, 30000);

    // Update on visibility change
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        updatePresence();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [user]);

  return null;
};

export const useUserPresence = (userId: string | null) => {
  const [presence, setPresence] = useState<UserPresence | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchPresence = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, last_active_at")
        .eq("user_id", userId)
        .single();

      if (data) {
        const lastActive = new Date((data as any).last_active_at);
        const now = new Date();
        const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60);
        
        setPresence({
          user_id: (data as any).user_id,
          is_online: diffMinutes < 5, // Consider online if active in last 5 minutes
          last_seen: (data as any).last_active_at,
        });
      }
    };

    fetchPresence();

    // Set up realtime subscription for this user's profile
    const channel = supabase
      .channel(`presence-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const lastActive = new Date((payload.new as any).last_active_at);
          const now = new Date();
          const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60);
          
          setPresence({
            user_id: (payload.new as any).user_id,
            is_online: diffMinutes < 5,
            last_seen: (payload.new as any).last_active_at,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return presence;
};

export const formatLastSeen = (lastSeen: string | null): string => {
  if (!lastSeen) return "Unknown";

  const lastActive = new Date(lastSeen);
  const now = new Date();
  const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 5) return "Online";
  if (diffMinutes < 60) return `${Math.floor(diffMinutes)}m ago`;
  
  const diffHours = diffMinutes / 60;
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  
  const diffDays = diffHours / 24;
  if (diffDays < 7) return `${Math.floor(diffDays)}d ago`;
  
  return lastActive.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
