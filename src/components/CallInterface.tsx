import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2,
  VolumeX,
  RotateCcw,
  Minimize2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CallInterfaceProps {
  isOpen: boolean;
  callType: "voice" | "video";
  otherUser: {
    display_name: string;
    photo_url: string | null;
  };
  onEnd: () => void;
  onMinimize?: () => void;
}

export function CallInterface({
  isOpen,
  callType,
  otherUser,
  onEnd,
  onMinimize,
}: CallInterfaceProps) {
  const [callStatus, setCallStatus] = useState<"ringing" | "connected" | "ended">("ringing");
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  // Simulate call connection after 3 seconds (placeholder behavior)
  useEffect(() => {
    if (isOpen && callStatus === "ringing") {
      const timer = setTimeout(() => {
        setCallStatus("connected");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, callStatus]);

  // Duration counter
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (callStatus === "connected") {
      interval = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEnd = () => {
    setCallStatus("ended");
    setTimeout(onEnd, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background erotic-pattern"
        >
          {/* Video background (placeholder) */}
          {callType === "video" && callStatus === "connected" && !isVideoOff && (
            <div className="absolute inset-0">
              <img
                src={otherUser.photo_url || "/placeholder.svg"}
                alt={otherUser.display_name}
                className="w-full h-full object-cover opacity-30 blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background" />
            </div>
          )}

          {/* Minimize button */}
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-muted/80 backdrop-blur flex items-center justify-center"
            >
              <Minimize2 className="h-5 w-5 text-foreground" />
            </button>
          )}

          <div className="relative z-10 h-full flex flex-col items-center justify-between py-16 px-6">
            {/* User info */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center"
            >
              <div className="relative inline-block mb-6">
                <div className="avatar-ring-passion">
                  <img
                    src={otherUser.photo_url || "/placeholder.svg"}
                    alt={otherUser.display_name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
                {callStatus === "ringing" && (
                  <div className="pulse-ring" />
                )}
              </div>

              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                {otherUser.display_name}
              </h2>

              <p className="text-muted-foreground">
                {callStatus === "ringing" && (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    {callType === "video" ? "Video calling..." : "Calling..."}
                  </motion.span>
                )}
                {callStatus === "connected" && formatDuration(duration)}
                {callStatus === "ended" && "Call ended"}
              </p>
            </motion.div>

            {/* Self video preview (placeholder) */}
            {callType === "video" && callStatus === "connected" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute bottom-32 right-4 w-24 h-32 rounded-2xl overflow-hidden border-2 border-primary shadow-lg"
              >
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  {isVideoOff ? (
                    <VideoOff className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <span className="text-xs text-muted-foreground">You</span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Controls */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              {/* Mute */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-destructive' : 'bg-muted'
                }`}
              >
                {isMuted ? (
                  <MicOff className="h-6 w-6 text-white" />
                ) : (
                  <Mic className="h-6 w-6 text-foreground" />
                )}
              </button>

              {/* Video toggle (video call only) */}
              {callType === "video" && (
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                    isVideoOff ? 'bg-destructive' : 'bg-muted'
                  }`}
                >
                  {isVideoOff ? (
                    <VideoOff className="h-6 w-6 text-white" />
                  ) : (
                    <Video className="h-6 w-6 text-foreground" />
                  )}
                </button>
              )}

              {/* End call */}
              <button
                onClick={handleEnd}
                className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center shadow-lg shadow-destructive/30"
              >
                <PhoneOff className="h-7 w-7 text-white" />
              </button>

              {/* Speaker */}
              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isSpeakerOn ? 'bg-primary' : 'bg-muted'
                }`}
              >
                {isSpeakerOn ? (
                  <Volume2 className="h-6 w-6 text-primary-foreground" />
                ) : (
                  <VolumeX className="h-6 w-6 text-foreground" />
                )}
              </button>

              {/* Flip camera (video only) */}
              {callType === "video" && (
                <button className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                  <RotateCcw className="h-6 w-6 text-foreground" />
                </button>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface IncomingCallProps {
  isOpen: boolean;
  callType: "voice" | "video";
  caller: {
    display_name: string;
    photo_url: string | null;
  };
  onAccept: () => void;
  onDecline: () => void;
}

export function IncomingCall({
  isOpen,
  callType,
  caller,
  onAccept,
  onDecline,
}: IncomingCallProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-4 right-4 z-50 p-4 rounded-2xl glass border border-border"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="avatar-ring-passion">
                <img
                  src={caller.photo_url || "/placeholder.svg"}
                  alt={caller.display_name}
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
              <div className="pulse-ring" />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {caller.display_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Incoming {callType} call...
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onDecline}
                className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center"
              >
                <PhoneOff className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={onAccept}
                className="w-12 h-12 rounded-full bg-success flex items-center justify-center"
              >
                {callType === "video" ? (
                  <Video className="h-5 w-5 text-white" />
                ) : (
                  <Phone className="h-5 w-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
