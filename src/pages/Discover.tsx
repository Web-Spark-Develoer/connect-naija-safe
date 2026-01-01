import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, SlidersHorizontal, X, Heart, Star, Zap, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/ProfileCard";
import { Logo } from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";

import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileWoman2 from "@/assets/profile-woman-2.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";

const mockProfiles = [
  {
    id: "1",
    name: "Chidimma",
    age: 24,
    location: "Lekki Phase 1",
    distance: "3km away",
    bio: "Love Afrobeats and beach weekends at Landmark. Looking for good vibes and someone who knows the best suya spots 🍖",
    image: profileWoman1,
    verified: true,
    interests: ["Afrobeats", "Suya dates", "Beach"],
  },
  {
    id: "2",
    name: "Emeka",
    age: 27,
    location: "Victoria Island",
    distance: "5km away",
    bio: "Tech bro by day, football lover by night. Let's argue about Arsenal or find the best amala in Lagos 🙌",
    image: profileMan1,
    verified: true,
    interests: ["Football", "Tech", "Amala"],
  },
  {
    id: "3",
    name: "Adaeze",
    age: 25,
    location: "Ikeja GRA",
    distance: "8km away",
    bio: "Fashion designer with a love for Nollywood. Looking for someone to binge movies and explore street food with ✨",
    image: profileWoman2,
    verified: false,
    interests: ["Fashion", "Nollywood", "Street food"],
  },
  {
    id: "4",
    name: "Tunde",
    age: 29,
    location: "Lekki Phase 2",
    distance: "4km away",
    bio: "Fitness enthusiast and Amapiano lover. Let's hit the gym then vibe at a beach club 🏋️‍♂️",
    image: profileMan2,
    verified: true,
    interests: ["Gym", "Amapiano", "Beach clubs"],
  },
];

const Discover = () => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedProfiles, setSwipedProfiles] = useState<string[]>([]);

  const remainingProfiles = useMemo(() => {
    return mockProfiles.filter((p) => !swipedProfiles.includes(p.id));
  }, [swipedProfiles]);

  const handleSwipe = (direction: "left" | "right" | "up") => {
    const profile = remainingProfiles[0];
    if (!profile) return;

    setSwipedProfiles((prev) => [...prev, profile.id]);

    if (direction === "right") {
      toast({
        title: "It's a vibe! 💚",
        description: `You liked ${profile.name}`,
      });
    } else if (direction === "up") {
      toast({
        title: "Super Like! ⭐",
        description: `${profile.name} will see you liked them first!`,
      });
    }
  };

  const handleAction = (action: "undo" | "dislike" | "superlike" | "like" | "boost") => {
    if (action === "undo" && swipedProfiles.length > 0) {
      setSwipedProfiles((prev) => prev.slice(0, -1));
      return;
    }

    if (remainingProfiles.length === 0) return;

    switch (action) {
      case "dislike":
        handleSwipe("left");
        break;
      case "like":
        handleSwipe("right");
        break;
      case "superlike":
        handleSwipe("up");
        break;
      case "boost":
        toast({
          title: "Boost activated! ⚡",
          description: "Your profile is now visible to more people for 30 minutes.",
        });
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 pt-safe">
        <Logo size="sm" showText={false} />
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-display font-bold text-foreground flex items-center gap-2">
            <Flame className="h-5 w-5 text-secondary" />
            Discover
          </span>
        </div>

        <Button variant="ghost" size="icon">
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </header>

      {/* Card Stack */}
      <div className="flex-1 relative px-4 py-2">
        <div className="relative h-[calc(100vh-280px)] max-h-[600px] w-full max-w-md mx-auto">
          <AnimatePresence>
            {remainingProfiles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Heart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  No more profiles
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  You've seen everyone nearby. Check back later or expand your distance settings.
                </p>
              </motion.div>
            ) : (
              remainingProfiles.slice(0, 3).map((profile, index) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onSwipe={handleSwipe}
                  isTop={index === 0}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
          <Button
            variant="action"
            size="icon"
            onClick={() => handleAction("undo")}
            disabled={swipedProfiles.length === 0}
          >
            <RotateCcw className="h-5 w-5 text-secondary" />
          </Button>

          <Button
            variant="action-dislike"
            size="icon-lg"
            onClick={() => handleAction("dislike")}
            disabled={remainingProfiles.length === 0}
          >
            <X className="h-7 w-7" />
          </Button>

          <Button
            variant="action-superlike"
            size="icon"
            onClick={() => handleAction("superlike")}
            disabled={remainingProfiles.length === 0}
          >
            <Star className="h-5 w-5" />
          </Button>

          <Button
            variant="action-like"
            size="icon-lg"
            onClick={() => handleAction("like")}
            disabled={remainingProfiles.length === 0}
          >
            <Heart className="h-7 w-7 fill-current" />
          </Button>

          <Button
            variant="action"
            size="icon"
            onClick={() => handleAction("boost")}
          >
            <Zap className="h-5 w-5 text-primary" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Discover;
