import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Profile } from "./useProfile";

export interface DiscoveryProfile extends Profile {
  photos: {
    id: string;
    photo_url: string;
    is_primary: boolean;
  }[];
  interests: {
    id: string;
    name: string;
    icon: string | null;
  }[];
  distance_km?: number;
}

export const useDiscoveryProfiles = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["discoveryProfiles", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get current user's profile for preferences
      const { data: myProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!myProfile) return [];

      // Get profiles that user hasn't swiped on yet
      const { data: swipedIds } = await supabase
        .from("swipes")
        .select("swiped_id")
        .eq("swiper_id", user.id);

      const alreadySwiped = (swipedIds || []).map((s: any) => s.swiped_id);

      // Get blocked users
      const { data: blockedIds } = await supabase
        .from("blocks")
        .select("blocked_id")
        .eq("blocker_id", user.id);

      const blocked = (blockedIds || []).map((b: any) => b.blocked_id);

      // Get profiles matching preferences
      let query = supabase
        .from("profiles")
        .select("*")
        .eq("is_active", true)
        .neq("user_id", user.id);

      // Apply gender preference filter
      const genderPref = (myProfile as any).gender_preference;
      if (genderPref && genderPref.length > 0) {
        query = query.in("gender", genderPref);
      }

      const { data: profiles, error } = await query.limit(50);

      if (error) throw error;

      // Filter out already swiped and blocked profiles
      const filteredProfiles = (profiles || []).filter(
        (p: any) => !alreadySwiped.includes(p.user_id) && !blocked.includes(p.user_id)
      );

      // Get photos for each profile
      const profilesWithPhotos = await Promise.all(
        filteredProfiles.map(async (profile: any) => {
          const { data: photos } = await supabase
            .from("user_photos")
            .select("id, photo_url, is_primary, display_order")
            .eq("user_id", profile.user_id)
            .order("display_order", { ascending: true });

          const { data: userInterests } = await supabase
            .from("user_interests")
            .select("interest_id")
            .eq("user_id", profile.user_id);

          let interests: any[] = [];
          if (userInterests && userInterests.length > 0) {
            const { data: interestDetails } = await supabase
              .from("interests")
              .select("id, name, icon")
              .in("id", userInterests.map((ui: any) => ui.interest_id));
            interests = interestDetails || [];
          }

          return {
            ...profile,
            photos: (photos || []).map((p: any) => ({
              id: p.id,
              photo_url: p.photo_url,
              is_primary: p.is_primary,
            })),
            interests,
          } as DiscoveryProfile;
        })
      );

      // Sort by boosted profiles first, then by last active
      return profilesWithPhotos.sort((a, b) => {
        const aBoostActive = a.profile_boost_active_until && 
          new Date(a.profile_boost_active_until) > new Date();
        const bBoostActive = b.profile_boost_active_until && 
          new Date(b.profile_boost_active_until) > new Date();
        
        if (aBoostActive && !bBoostActive) return -1;
        if (!aBoostActive && bBoostActive) return 1;
        
        return new Date(b.last_active_at).getTime() - new Date(a.last_active_at).getTime();
      });
    },
    enabled: !!user,
  });
};

export const useSwipe = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      targetUserId, 
      action 
    }: { 
      targetUserId: string; 
      action: "like" | "pass" | "super_like";
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Check if user has swipes remaining
      const { data: profile } = await supabase
        .from("profiles")
        .select("daily_swipes_remaining, daily_super_likes_remaining")
        .eq("user_id", user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      const profileData = profile as any;

      if (action === "super_like" && profileData.daily_super_likes_remaining <= 0) {
        throw new Error("No super likes remaining today");
      }

      if (action !== "pass" && profileData.daily_swipes_remaining <= 0) {
        throw new Error("No swipes remaining today");
      }

      // Record the swipe
      const { error: swipeError } = await supabase
        .from("swipes")
        .insert({
          swiper_id: user.id,
          swiped_id: targetUserId,
          action,
        } as any);

      if (swipeError) throw swipeError;

      // Decrement swipe count
      if (action === "super_like") {
        await supabase
          .from("profiles")
          .update({ 
            daily_super_likes_remaining: profileData.daily_super_likes_remaining - 1,
            daily_swipes_remaining: profileData.daily_swipes_remaining - 1,
          } as any)
          .eq("user_id", user.id);
      } else if (action === "like") {
        await supabase
          .from("profiles")
          .update({ 
            daily_swipes_remaining: profileData.daily_swipes_remaining - 1,
          } as any)
          .eq("user_id", user.id);
      }

      // Check if this creates a match (handled by database trigger)
      const { data: match } = await supabase
        .from("matches")
        .select("*")
        .or(`and(user_a_id.eq.${user.id},user_b_id.eq.${targetUserId}),and(user_a_id.eq.${targetUserId},user_b_id.eq.${user.id})`)
        .maybeSingle();

      return { isMatch: !!match, match };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discoveryProfiles"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
};

export const useMatches = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["matches", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: matches, error } = await supabase
        .from("matches")
        .select("*")
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .eq("is_active", true)
        .order("matched_at", { ascending: false });

      if (error) throw error;

      // Get profiles for each match
      const matchesWithProfiles = await Promise.all(
        (matches || []).map(async (match: any) => {
          const otherUserId = match.user_a_id === user.id ? match.user_b_id : match.user_a_id;
          
          const { data: otherProfile } = await supabase
            .from("profiles")
            .select("user_id, display_name")
            .eq("user_id", otherUserId)
            .single();

          const { data: photos } = await supabase
            .from("user_photos")
            .select("id, photo_url, is_primary")
            .eq("user_id", otherUserId)
            .order("display_order", { ascending: true })
            .limit(1);

          return {
            ...match,
            otherUser: {
              ...otherProfile,
              photo_url: photos?.[0]?.photo_url || null,
            },
          };
        })
      );

      return matchesWithProfiles;
    },
    enabled: !!user,
  });
};

export const useLikes = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["likes", user?.id],
    queryFn: async () => {
      if (!user) return { likes: [], canSee: false };

      // Get profile to check subscription tier
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("user_id", user.id)
        .single();

      const profileData = profile as any;

      // Only premium users can see who liked them
      if (profileData?.subscription_tier === "free") {
        // Get count only
        const { count } = await supabase
          .from("swipes")
          .select("*", { count: "exact", head: true })
          .eq("swiped_id", user.id)
          .in("action", ["like", "super_like"]);

        return { likes: [], canSee: false, count: count || 0 };
      }

      const { data: swipes, error } = await supabase
        .from("swipes")
        .select("*")
        .eq("swiped_id", user.id)
        .in("action", ["like", "super_like"])
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get profiles for each swipe
      const likesWithProfiles = await Promise.all(
        (swipes || []).map(async (swipe: any) => {
          const { data: swiperProfile } = await supabase
            .from("profiles")
            .select("user_id, display_name")
            .eq("user_id", swipe.swiper_id)
            .single();

          const { data: photos } = await supabase
            .from("user_photos")
            .select("id, photo_url, is_primary")
            .eq("user_id", swipe.swiper_id)
            .order("display_order", { ascending: true })
            .limit(1);

          return {
            ...swipe,
            swiper: {
              ...swiperProfile,
              photo_url: photos?.[0]?.photo_url || null,
            },
          };
        })
      );

      // Filter out users we've already matched with
      const { data: matchedIds } = await supabase
        .from("matches")
        .select("user_a_id, user_b_id")
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`);

      const matchedUserIds = new Set(
        (matchedIds || []).flatMap((m: any) => [m.user_a_id, m.user_b_id]).filter((id: string) => id !== user.id)
      );

      const filteredLikes = likesWithProfiles.filter(like => !matchedUserIds.has(like.swiper_id));

      return {
        likes: filteredLikes,
        canSee: true,
      };
    },
    enabled: !!user,
  });
};
