import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const usePhotoUpload = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const uploadPhoto = useMutation({
    mutationFn: async ({ file, isPrimary = false }: { file: File; isPrimary?: boolean }) => {
      if (!user) throw new Error("Not authenticated");

      setUploading(true);

      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("user-photos")
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("user-photos")
        .getPublicUrl(filePath);

      // Get current photo count for display order
      const { data: existingPhotos } = await supabase
        .from("user_photos")
        .select("id")
        .eq("user_id", user.id);

      const displayOrder = existingPhotos?.length || 0;

      // If this is primary, unset other primaries first
      if (isPrimary) {
        await supabase
          .from("user_photos")
          .update({ is_primary: false } as any)
          .eq("user_id", user.id);
      }

      // Insert photo record
      const { data, error } = await supabase
        .from("user_photos")
        .insert({
          user_id: user.id,
          photo_url: urlData.publicUrl,
          is_primary: isPrimary || displayOrder === 0,
          display_order: displayOrder,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPhotos"] });
      setUploading(false);
    },
    onError: () => {
      setUploading(false);
    },
  });

  const deletePhoto = useMutation({
    mutationFn: async (photoId: string) => {
      if (!user) throw new Error("Not authenticated");

      // Get photo URL to delete from storage
      const { data: photo } = await supabase
        .from("user_photos")
        .select("photo_url")
        .eq("id", photoId)
        .single();

      if (photo?.photo_url) {
        // Extract file path from URL
        const urlParts = photo.photo_url.split("/user-photos/");
        if (urlParts[1]) {
          await supabase.storage.from("user-photos").remove([urlParts[1]]);
        }
      }

      const { error } = await supabase
        .from("user_photos")
        .delete()
        .eq("id", photoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPhotos"] });
    },
  });

  const setPrimaryPhoto = useMutation({
    mutationFn: async (photoId: string) => {
      if (!user) throw new Error("Not authenticated");

      // Unset all other primaries
      await supabase
        .from("user_photos")
        .update({ is_primary: false } as any)
        .eq("user_id", user.id);

      // Set new primary
      const { error } = await supabase
        .from("user_photos")
        .update({ is_primary: true } as any)
        .eq("id", photoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPhotos"] });
    },
  });

  return {
    uploadPhoto,
    deletePhoto,
    setPrimaryPhoto,
    uploading,
  };
};
