import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Ruler,
  Heart,
  Flag,
  CheckCircle2,
  Share2,
  Ban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscoveryProfile } from "@/hooks/useDiscovery";

interface ExpandedProfileProps {
  profile: DiscoveryProfile;
  isOpen: boolean;
  onClose: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onPass: () => void;
  onReport: () => void;
  onBlock: () => void;
}

export function ExpandedProfile({
  profile,
  isOpen,
  onClose,
  onLike,
  onSuperLike,
  onPass,
  onReport,
  onBlock,
}: ExpandedProfileProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photos = profile.photos || [];

  const nextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(profile.date_of_birth);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background overflow-y-auto"
        >
          {/* Photo Gallery */}
          <div className="relative h-[70vh] min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhotoIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={photos[currentPhotoIndex]?.photo_url || "/placeholder.svg"}
                alt={profile.display_name}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center z-10"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>

            {/* Photo navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  disabled={currentPhotoIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/50 backdrop-blur flex items-center justify-center disabled:opacity-30"
                >
                  <ChevronLeft className="h-6 w-6 text-foreground" />
                </button>
                <button
                  onClick={nextPhoto}
                  disabled={currentPhotoIndex === photos.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/50 backdrop-blur flex items-center justify-center disabled:opacity-30"
                >
                  <ChevronRight className="h-6 w-6 text-foreground" />
                </button>
              </>
            )}

            {/* Photo indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`gallery-dot ${index === currentPhotoIndex ? 'active' : 'bg-foreground/50'}`}
                />
              ))}
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-6 -mt-16 relative z-10 pb-32">
            {/* Name and basics */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-3xl font-bold text-foreground">
                    {profile.display_name}, {age}
                  </h1>
                  {profile.is_verified && (
                    <CheckCircle2 className="h-6 w-6 text-primary fill-primary/20" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {profile.location_city || "Nearby"}
                    {profile.distance_km && ` • ${profile.distance_km}km away`}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={onReport}>
                  <Flag className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onBlock}>
                  <Ban className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mb-6 p-4 rounded-2xl bg-muted/50 border border-border">
                <p className="text-foreground leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Details */}
            <div className="space-y-4 mb-6">
              {profile.occupation && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-foreground">{profile.occupation}</span>
                </div>
              )}

              {profile.education && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-foreground">{profile.education}</span>
                </div>
              )}

              {profile.height_cm && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Ruler className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-foreground">{profile.height_cm}cm</span>
                </div>
              )}

              {profile.looking_for && profile.looking_for.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Heart className="h-5 w-5 text-tertiary" />
                  </div>
                  <span className="text-foreground capitalize">
                    Looking for {profile.looking_for.join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span key={interest.id} className="interest-tag">
                      {interest.icon && <span className="mr-1">{interest.icon}</span>}
                      {interest.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
              <Share2 className="h-5 w-5" />
              Share {profile.display_name}'s Profile
            </Button>
          </div>

          {/* Fixed Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pb-safe">
            <div className="flex items-center justify-center gap-6 max-w-sm mx-auto">
              <Button
                variant="action-dislike"
                size="icon-lg"
                onClick={() => { onPass(); onClose(); }}
              >
                <X className="h-8 w-8" />
              </Button>

              <Button
                variant="action-superlike"
                size="icon"
                onClick={() => { onSuperLike(); onClose(); }}
              >
                <Heart className="h-6 w-6 text-secondary" />
              </Button>

              <Button
                variant="action-like"
                size="icon-lg"
                onClick={() => { onLike(); onClose(); }}
              >
                <Heart className="h-8 w-8 fill-current" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
