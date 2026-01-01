import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  date_of_birth: string;
  gender: "male" | "female" | "non_binary" | "other";
  bio: string | null;
  occupation: string | null;
  education: string | null;
  height_cm: number | null;
  location_lat: number | null;
  location_lng: number | null;
  location_city: string | null;
  looking_for: string[];
  min_age_preference: number;
  max_age_preference: number;
  max_distance_km: number;
  gender_preference: string[] | null;
  verification_status: "pending" | "verified" | "rejected";
  is_verified: boolean;
  is_active: boolean;
  last_active_at: string;
  daily_swipes_remaining: number;
  daily_super_likes_remaining: number;
  subscription_tier: "free" | "gold" | "platinum";
  profile_boost_active_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  is_primary: boolean;
  is_verified: boolean;
  display_order: number;
  created_at: string;
}

export interface Interest {
  id: string;
  name: string;
  category: string;
  icon: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!user,
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (profileData: {
      display_name: string;
      date_of_birth: string;
      gender: "male" | "female" | "non_binary" | "other";
      bio?: string;
      occupation?: string;
      education?: string;
      height_cm?: number;
      location_lat?: number;
      location_lng?: number;
      location_city?: string;
      looking_for?: string[];
      min_age_preference?: number;
      max_age_preference?: number;
      max_distance_km?: number;
      gender_preference?: string[];
    }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          display_name: profileData.display_name,
          date_of_birth: profileData.date_of_birth,
          gender: profileData.gender,
          bio: profileData.bio,
          occupation: profileData.occupation,
          education: profileData.education,
          height_cm: profileData.height_cm,
          location_lat: profileData.location_lat,
          location_lng: profileData.location_lng,
          location_city: profileData.location_city,
          looking_for: profileData.looking_for,
          min_age_preference: profileData.min_age_preference,
          max_age_preference: profileData.max_age_preference,
          max_distance_km: profileData.max_distance_km,
          gender_preference: profileData.gender_preference as any,
        } as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (profileData: Partial<Omit<Profile, "id" | "user_id" | "created_at" | "updated_at">>) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("profiles")
        .update(profileData as any)
        .eq("user_id", user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useUserPhotos = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userPhotos", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("user_photos")
        .select("*")
        .eq("user_id", user.id)
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return (data || []) as UserPhoto[];
    },
    enabled: !!user,
  });
};

export const useInterests = () => {
  return useQuery({
    queryKey: ["interests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interests")
        .select("*")
        .order("category", { ascending: true });
      
      if (error) throw error;
      return (data || []) as Interest[];
    },
  });
};

export const useUserInterests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userInterests", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("user_interests")
        .select("id, interest_id")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useUpdateUserInterests = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (interestIds: string[]) => {
      if (!user) throw new Error("Not authenticated");
      
      // Delete existing interests
      await supabase
        .from("user_interests")
        .delete()
        .eq("user_id", user.id);
      
      // Insert new interests
      if (interestIds.length > 0) {
        const { error } = await supabase
          .from("user_interests")
          .insert(interestIds.map(id => ({
            user_id: user.id,
            interest_id: id,
          })) as any);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInterests"] });
    },
  });
};
