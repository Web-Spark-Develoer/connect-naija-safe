import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, SlidersHorizontal, X, Heart, Star, Zap, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/ProfileCard";
import { Logo } from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { useDiscoveryProfiles, useSwipe, DiscoveryProfile } from "@/hooks/useDiscovery";
import { useProfile } from "@/hooks/useProfile";

const Discover = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: profiles, isLoading, refetch } = useDiscoveryProfiles();
  const { data: myProfile } = useProfile();
  const swipeMutation = useSwipe();
  
  const [swipedIds, setSwipedIds] = useState<string[]>([]);
  const [lastSwipedId, setLastSwipedId] = useState<string | null>(null);

  const remainingProfiles = useMemo(() => {
    return (profiles || []).filter((p) => !swipedIds.includes(p.user_id));
  }, [profiles, swipedIds]);

  const handleSwipe = async (direction: "left" | "right" | "up") => {
    const profile = remainingProfiles[0];
    if (!profile) return;

    // Optimistically remove from list
    setSwipedIds((prev) => [...prev, profile.user_id]);
    setLastSwipedId(profile.user_id);

    const action = direction === "right" ? "like" : direction === "up" ? "super_like" : "pass";

    try {
      const result = await swipeMutation.mutateAsync({
        targetUserId: profile.user_id,
        action,
      });

      if (result.isMatch) {
        toast({
          title: "It's a Match! 🎉",
          description: `You and ${profile.display_name} liked each other! Start chatting now.`,
        });
      } else if (direction === "right") {
        toast({
          title: "It's a vibe! 💚",
          description: `You liked ${profile.display_name}`,
        });
      } else if (direction === "up") {
        toast({
          title: "Super Like! ⭐",
          description: `${profile.display_name} will see you liked them first!`,
        });
      }
    } catch (error: any) {
      // Revert optimistic update
      setSwipedIds((prev) => prev.filter(id => id !== profile.user_id));
      
      toast({
        title: "Swipe failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleAction = async (action: "undo" | "dislike" | "superlike" | "like" | "boost") => {
    if (action === "undo" && lastSwipedId) {
      setSwipedIds((prev) => prev.filter(id => id !== lastSwipedId));
      setLastSwipedId(null);
      toast({
        title: "Undo successful",
        description: "Profile restored to your deck",
      });
      return;
    }

    if (remainingProfiles.length === 0) return;

    switch (action) {
      case "dislike":
        await handleSwipe("left");
        break;
      case "like":
        await handleSwipe("right");
        break;
      case "superlike":
        await handleSwipe("up");
        break;
      case "boost":
        toast({
          title: "Boost activated! ⚡",
          description: "Your profile is now visible to more people for 30 minutes.",
        });
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background pb-24">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Finding matches near you...</p>
      </div>
    );
  }

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

        <Button variant="ghost" size="icon" onClick={() => navigate("/discovery-settings")}>
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </header>

      {/* Swipe Stats */}
      {myProfile && (
        <div className="px-4 py-2 flex justify-center gap-4 text-sm">
          <span className="text-muted-foreground">
            <Heart className="h-4 w-4 inline mr-1 text-secondary" />
            {myProfile.daily_swipes_remaining} swipes left
          </span>
          <span className="text-muted-foreground">
            <Star className="h-4 w-4 inline mr-1 text-primary" />
            {myProfile.daily_super_likes_remaining} super likes
          </span>
        </div>
      )}

      {/* Card Stack */}
      <div className="flex-1 relative px-4 py-2">
        <div className="relative h-[calc(100vh-320px)] max-h-[550px] w-full max-w-md mx-auto">
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
                  {profiles?.length === 0 ? "No profiles yet" : "No more profiles"}
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs mb-4">
                  {profiles?.length === 0 
                    ? "Be the first to create a profile and start matching!"
                    : "You've seen everyone nearby. Check back later or expand your distance settings."
                  }
                </p>
                <Button variant="outline" onClick={() => refetch()}>
                  Refresh
                </Button>
              </motion.div>
            ) : (
              remainingProfiles.slice(0, 3).map((profile, index) => (
                <ProfileCard
                  key={profile.user_id}
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
            disabled={!lastSwipedId || swipeMutation.isPending}
          >
            <RotateCcw className="h-5 w-5 text-secondary" />
          </Button>

          <Button
            variant="action-dislike"
            size="icon-lg"
            onClick={() => handleAction("dislike")}
            disabled={remainingProfiles.length === 0 || swipeMutation.isPending}
          >
            <X className="h-7 w-7" />
          </Button>

          <Button
            variant="action-superlike"
            size="icon"
            onClick={() => handleAction("superlike")}
            disabled={remainingProfiles.length === 0 || swipeMutation.isPending || (myProfile?.daily_super_likes_remaining || 0) <= 0}
          >
            <Star className="h-5 w-5" />
          </Button>

          <Button
            variant="action-like"
            size="icon-lg"
            onClick={() => handleAction("like")}
            disabled={remainingProfiles.length === 0 || swipeMutation.isPending || (myProfile?.daily_swipes_remaining || 0) <= 0}
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
