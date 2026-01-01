import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, MoreVertical, Phone, Video, Image, Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMessages, useSendMessage, Message } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface ChatRoomProps {
  matchId: string;
  otherUser: {
    user_id: string;
    display_name: string;
    photo_url: string | null;
  };
  onBack: () => void;
}

export function ChatRoom({ matchId, otherUser, onBack }: ChatRoomProps) {
  const { user } = useAuth();
  const { data: messages, isLoading } = useMessages(matchId);
  const sendMessage = useSendMessage();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sendMessage.isPending) return;

    const messageContent = newMessage.trim();
    setNewMessage("");

    try {
      await sendMessage.mutateAsync({
        matchId,
        content: messageContent,
      });
    } catch (error) {
      // Restore message on error
      setNewMessage(messageContent);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/95 backdrop-blur">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <img
              src={otherUser.photo_url || "/placeholder.svg"}
              alt={otherUser.display_name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-background" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{otherUser.display_name}</h2>
            <p className="text-xs text-muted-foreground">Online now</p>
          </div>
        </div>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <img
              src={otherUser.photo_url || "/placeholder.svg"}
              alt={otherUser.display_name}
              className="w-20 h-20 rounded-full object-cover mb-4"
            />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              You matched with {otherUser.display_name}!
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Say hello and start a conversation. Be genuine and respectful!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {messages?.map((message, index) => {
                const isOwn = message.sender_id === user?.id;
                const showTimestamp = 
                  index === 0 || 
                  new Date(message.created_at).getTime() - 
                  new Date(messages[index - 1].created_at).getTime() > 300000; // 5 minutes

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
                      {showTimestamp && (
                        <p className="text-xs text-muted-foreground mb-1 text-center w-full">
                          {formatMessageTime(message.created_at)}
                        </p>
                      )}
                      <div
                        className={`px-4 py-2.5 rounded-2xl ${
                          isOwn
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                      {isOwn && message.is_read && (
                        <p className="text-xs text-muted-foreground mt-0.5 text-right">
                          Read
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-border bg-background/95 backdrop-blur pb-safe">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Image className="h-5 w-5 text-muted-foreground" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              variant="glass"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="pr-12"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <Mic className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          <Button
            variant="hero"
            size="icon"
            className="shrink-0 rounded-full"
            onClick={handleSend}
            disabled={!newMessage.trim() || sendMessage.isPending}
          >
            {sendMessage.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
