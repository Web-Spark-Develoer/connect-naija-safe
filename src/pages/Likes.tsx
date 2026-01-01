import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Lock, Crown, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLikes, useSwipe } from "@/hooks/useDiscovery";

const Likes = () => {
  const { toast } = useToast();
  const { data: likesData, isLoading, refetch } = useLikes();
  const swipeMutation = useSwipe();

  const handleLikeBack = async (userId: string, displayName: string) => {
    try {
      const result = await swipeMutation.mutateAsync({
        targetUserId: userId,
        action: "like",
      });

      if (result.isMatch) {
        toast({
          title: "It's a Match! 🎉",
          description: `You and ${displayName} can now chat!`,
        });
        refetch();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background pb-24">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading likes...</p>
      </div>
    );
  }

  const canSee = likesData?.canSee ?? false;
  const likes = likesData?.likes ?? [];
  const count = (likesData as any)?.count ?? likes.length;

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      {/* Header */}
      <header className="px-4 py-6 pt-safe">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-8 w-8 text-secondary fill-secondary" />
            Likes
          </h1>
          <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {count} {count === 1 ? "person" : "people"}
          </span>
        </div>
        <p className="text-muted-foreground">
          {canSee ? "People who liked your profile" : "Upgrade to see who likes you"}
        </p>
      </header>

      {!canSee ? (
        /* Premium Upgrade CTA */
        <div className="flex-1 px-4 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mb-6"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
              <Lock className="h-12 w-12 text-muted-foreground" />
            </div>
            {count > 0 && (
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg">
                {count}
              </div>
            )}
          </motion.div>

          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            {count > 0 ? `${count} ${count === 1 ? "person likes" : "people like"} you!` : "See who likes you"}
          </h2>
          <p className="text-muted-foreground max-w-xs mb-8">
            Upgrade to NaijaConnect Gold to see who liked you and match instantly.
          </p>

          <Button variant="hero" size="xl" className="gap-2">
            <Crown className="h-5 w-5" />
            Upgrade to Gold
          </Button>

          {/* Blurred Preview */}
          {count > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-xs">
              {[1, 2, 3, 4].slice(0, Math.min(count, 4)).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="aspect-[3/4] rounded-2xl bg-muted/50 backdrop-blur-xl overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-primary/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/80 to-transparent">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : likes.length === 0 ? (
        /* No Likes Yet */
        <div className="flex-1 px-4 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6"
          >
            <Sparkles className="h-10 w-10 text-muted-foreground" />
          </motion.div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            No likes yet
          </h2>
          <p className="text-muted-foreground max-w-xs">
            Keep swiping and improving your profile. The likes will come!
          </p>
        </div>
      ) : (
        /* Likes Grid */
        <div className="flex-1 px-4">
          <div className="grid grid-cols-2 gap-3">
            {likes.map((like: any, index: number) => (
              <motion.div
                key={like.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden group"
              >
                <img
                  src={like.swiper?.photo_url || "/placeholder.svg"}
                  alt={like.swiper?.display_name}
                  className="h-full w-full object-cover"
                />

                {/* Super Like Badge */}
                {like.action === "super_like" && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Super Like
                  </div>
                )}

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/80 to-transparent">
                  <h3 className="font-semibold text-foreground text-lg">
                    {like.swiper?.display_name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Liked you • Tap to like back
                  </p>
                </div>

                {/* Like Back Button */}
                <button
                  onClick={() => handleLikeBack(like.swiper_id, like.swiper?.display_name)}
                  disabled={swipeMutation.isPending}
                  className="absolute inset-0 flex items-center justify-center bg-primary/0 hover:bg-primary/20 transition-colors group-hover:opacity-100 opacity-0"
                >
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Heart className="h-8 w-8 text-primary-foreground fill-current" />
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Likes;
