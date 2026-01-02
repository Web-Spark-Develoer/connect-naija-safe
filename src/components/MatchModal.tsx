import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: () => void;
  onKeepSwiping: () => void;
  currentUserPhoto: string;
  matchedUserPhoto: string;
  matchedUserName: string;
}

export function MatchModal({
  isOpen,
  onClose,
  onSendMessage,
  onKeepSwiping,
  currentUserPhoto,
  matchedUserPhoto,
  matchedUserName,
}: MatchModalProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      // Generate confetti
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: ['#d4af37', '#9f7aea', '#ed64a6', '#f687b3'][Math.floor(Math.random() * 4)],
        delay: Math.random() * 2,
      }));
      setConfetti(newConfetti);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="match-overlay"
          onClick={onClose}
        >
          {/* Confetti */}
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="confetti w-3 h-3 rounded-sm"
              style={{
                left: `${piece.left}%`,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}s`,
              }}
            />
          ))}

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative z-10 text-center px-6 max-w-sm mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 mb-8"
            >
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="font-display text-4xl font-bold text-gradient-erotic">
                It's a Match!
              </h2>
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>

            {/* Photos */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="flex items-center justify-center -space-x-8 mb-6"
            >
              <div className="relative">
                <div className="avatar-ring-passion">
                  <img
                    src={currentUserPhoto || "/placeholder.svg"}
                    alt="You"
                    className="w-28 h-28 rounded-full object-cover"
                  />
                </div>
              </div>

              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5,
                }}
                className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-primary via-secondary to-tertiary flex items-center justify-center shadow-lg"
              >
                <Heart className="h-8 w-8 text-white fill-current" />
              </motion.div>

              <div className="relative">
                <div className="avatar-ring-passion">
                  <img
                    src={matchedUserPhoto || "/placeholder.svg"}
                    alt={matchedUserName}
                    className="w-28 h-28 rounded-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-muted-foreground mb-8"
            >
              You and <span className="text-foreground font-semibold">{matchedUserName}</span> like each other
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <Button
                variant="hero"
                size="xl"
                className="w-full gap-2"
                onClick={onSendMessage}
              >
                <MessageCircle className="h-5 w-5" />
                Send a Message
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="w-full text-muted-foreground"
                onClick={onKeepSwiping}
              >
                Keep Swiping
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
