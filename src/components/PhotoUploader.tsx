import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Crown, Loader2, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import type { UserPhoto } from "@/hooks/useProfile";

interface PhotoUploaderProps {
  photos: UserPhoto[];
  maxPhotos?: number;
  showLabels?: boolean;
}

const PhotoUploader = ({ photos, maxPhotos = 6, showLabels = true }: PhotoUploaderProps) => {
  const { toast } = useToast();
  const { uploadPhoto, deletePhoto, setPrimaryPhoto, uploading } = usePhotoUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, WebP, or GIF image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      await uploadPhoto.mutateAsync({ file, isPrimary: photos.length === 0 });
      toast({ title: "Photo uploaded!" });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (photoId: string) => {
    setDeletingId(photoId);
    try {
      await deletePhoto.mutateAsync(photoId);
      toast({ title: "Photo deleted" });
    } catch (error: any) {
      toast({
        title: "Failed to delete",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetPrimary = async (photoId: string) => {
    try {
      await setPrimaryPhoto.mutateAsync(photoId);
      toast({ title: "Primary photo updated!" });
    } catch (error: any) {
      toast({
        title: "Failed to update",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-3">
      {showLabels && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">My Photos</h2>
            <span className="text-sm text-primary">{photos.length}/{maxPhotos} ADDED</span>
          </div>
          <p className="text-sm text-muted-foreground">Tap a photo to set as primary.</p>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="grid grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {/* Existing Photos */}
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden group"
            >
              <img
                src={photo.photo_url}
                alt="Profile"
                className="h-full w-full object-cover cursor-pointer"
                onClick={() => !photo.is_primary && handleSetPrimary(photo.id)}
              />

              {/* Primary Badge */}
              {photo.is_primary && (
                <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  MAIN
                </div>
              )}

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(photo.id)}
                disabled={deletingId === photo.id}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
              >
                {deletingId === photo.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </button>

              {/* Hover overlay for non-primary */}
              {!photo.is_primary && (
                <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-2 py-1 rounded-md bg-background/80 text-xs font-medium">
                    Set as primary
                  </span>
                </div>
              )}
            </motion.div>
          ))}

          {/* Add Photo Button */}
          {photos.length < maxPhotos && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="aspect-[3/4] rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center hover:border-primary transition-colors gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Plus className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground">Add Photo</span>
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PhotoUploader;
