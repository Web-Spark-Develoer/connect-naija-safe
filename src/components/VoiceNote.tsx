import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Play, Pause, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceNoteProps {
  onSend: (audioBlob: Blob, duration: number) => void;
  onCancel: () => void;
}

export function VoiceNoteRecorder({ onSend, onCancel }: VoiceNoteProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = () => {
    if (recordedBlob && !isPlaying) {
      const url = URL.createObjectURL(recordedBlob);
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.play();
      setIsPlaying(true);
    } else if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSend = () => {
    if (recordedBlob) {
      onSend(recordedBlob, duration);
    }
  };

  const handleDelete = () => {
    setRecordedBlob(null);
    setDuration(0);
    onCancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex items-center gap-3 p-3 rounded-2xl bg-muted border border-border"
    >
      {!recordedBlob ? (
        <>
          {/* Recording UI */}
          <Button
            variant={isRecording ? "destructive" : "ghost"}
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            className="shrink-0"
          >
            {isRecording ? (
              <Square className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>

          <div className="flex-1 flex items-center gap-2">
            {isRecording && (
              <>
                <span className="recording-indicator" />
                <span className="text-sm text-foreground font-medium">
                  Recording... {formatTime(duration)}
                </span>
              </>
            )}
            {!isRecording && (
              <span className="text-sm text-muted-foreground">
                Tap to record
              </span>
            )}
          </div>

          <Button variant="ghost" size="icon" onClick={onCancel}>
            <Trash2 className="h-5 w-5 text-muted-foreground" />
          </Button>
        </>
      ) : (
        <>
          {/* Playback UI */}
          <Button
            variant="ghost"
            size="icon"
            onClick={playRecording}
            className="shrink-0"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-primary" />
            ) : (
              <Play className="h-5 w-5 text-primary" />
            )}
          </Button>

          <div className="flex-1">
            <div className="h-8 bg-secondary/20 rounded-full flex items-center px-3">
              <div className="flex gap-1 items-end h-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-secondary"
                    style={{ height: `${20 + Math.random() * 80}%` }}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              {formatTime(duration)}
            </span>
          </div>

          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>

          <Button variant="hero" size="icon" onClick={handleSend}>
            <Send className="h-5 w-5" />
          </Button>
        </>
      )}
    </motion.div>
  );
}

interface VoiceNotePlayerProps {
  audioUrl: string;
  duration: number;
  isSent: boolean;
}

export function VoiceNotePlayer({ audioUrl, duration, isSent }: VoiceNotePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setProgress(0);
      };
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`voice-note ${isSent ? 'bg-primary/20' : ''}`}>
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center shrink-0"
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 text-secondary" />
        ) : (
          <Play className="h-5 w-5 text-secondary ml-0.5" />
        )}
      </button>

      <div className="flex-1">
        <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <span className="text-xs text-muted-foreground shrink-0">
        {formatTime(duration)}
      </span>
    </div>
  );
}
