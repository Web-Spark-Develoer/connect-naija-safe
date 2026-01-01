import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { MapPin, CheckCircle2 } from "lucide-react";

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    age: number;
    location: string;
    distance: string;
    bio: string;
    image: string;
    verified: boolean;
    interests: string[];
  };
  onSwipe: (direction: "left" | "right" | "up") => void;
  isTop?: boolean;
}

export function ProfileCard({ profile, onSwipe, isTop = false }: ProfileCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const superlikeOpacity = useTransform(y, [-100, 0], [1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      onSwipe("right");
    } else if (info.offset.x < -threshold) {
      onSwipe("left");
    } else if (info.offset.y < -threshold) {
      onSwipe("up");
    }
  };

  return (
    <motion.div
      className="swipe-card cursor-grab active:cursor-grabbing"
      style={{ x, y, rotate, zIndex: isTop ? 10 : 0 }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.02 }}
    >
      <div className="profile-card h-full w-full">
        {/* Profile Image */}
        <img
          src={profile.image}
          alt={profile.name}
          className="h-full w-full object-cover"
          draggable={false}
        />

        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-8 right-8 px-4 py-2 rounded-lg border-4 border-primary bg-primary/20 rotate-12"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-2xl font-bold text-primary">LIKE</span>
        </motion.div>

        <motion.div
          className="absolute top-8 left-8 px-4 py-2 rounded-lg border-4 border-destructive bg-destructive/20 -rotate-12"
          style={{ opacity: nopeOpacity }}
        >
          <span className="text-2xl font-bold text-destructive">NOPE</span>
        </motion.div>

        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg border-4 border-primary bg-primary/20"
          style={{ opacity: superlikeOpacity }}
        >
          <span className="text-2xl font-bold text-primary">SUPER LIKE</span>
        </motion.div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/80 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="font-display text-3xl font-bold text-foreground">
              {profile.name}, {profile.age}
            </h2>
            {profile.verified && (
              <CheckCircle2 className="h-6 w-6 text-primary fill-primary/20" />
            )}
          </div>

          <div className="flex items-center gap-1 text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{profile.location} • {profile.distance}</span>
          </div>

          <p className="text-foreground/80 text-sm mb-4 line-clamp-2">
            {profile.bio}
          </p>

          <div className="flex flex-wrap gap-2">
            {profile.interests.slice(0, 3).map((interest) => (
              <span key={interest} className="interest-tag">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
