import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Camera, Loader2, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatRoom } from "@/components/ChatRoom";
import { useConversations, Conversation } from "@/hooks/useMessages";
import { useMatches } from "@/hooks/useDiscovery";
import { formatDistanceToNow } from "date-fns";

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<{
    matchId: string;
    otherUser: Conversation["other_user"];
  } | null>(null);

  const { data: conversations, isLoading: conversationsLoading } = useConversations();
  const { data: matches, isLoading: matchesLoading } = useMatches();

  // Filter new matches that don't have messages yet
  const newMatches = matches?.filter(match => {
    const hasConversation = conversations?.some(c => c.match_id === match.id);
    return !hasConversation;
  }) || [];

  // Filter conversations by search
  const filteredConversations = conversations?.filter(conv =>
    conv.other_user.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return formatDistanceToNow(date, { addSuffix: false }).replace("about ", "").replace("less than ", "");
    }
    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }
    if (diffInHours < 48) {
      return "Yesterday";
    }
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  if (selectedChat) {
    return (
      <ChatRoom
        matchId={selectedChat.matchId}
        otherUser={selectedChat.otherUser}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  const isLoading = conversationsLoading || matchesLoading;

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      {/* Header */}
      <header className="px-4 py-6 pt-safe">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground">Messages</h1>
          <Button variant="ghost" size="icon">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <Input
          variant="search"
          placeholder="Search matches..."
          icon={<Search className="h-5 w-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </header>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* New Matches */}
          {newMatches.length > 0 && (
            <section className="px-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  New Matches
                </h2>
                <span className="text-sm text-primary">{newMatches.length} new</span>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {newMatches.map((match, index) => (
                  <motion.button
                    key={match.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedChat({
                      matchId: match.id,
                      otherUser: {
                        user_id: match.otherUser?.user_id || "",
                        display_name: match.otherUser?.display_name || "Unknown",
                        photo_url: match.otherUser?.photo_url || null,
                      },
                    })}
                    className="flex flex-col items-center gap-2 min-w-[72px]"
                  >
                    <div className="avatar-ring-primary">
                      <img
                        src={match.otherUser?.photo_url || "/placeholder.svg"}
                        alt={match.otherUser?.display_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-foreground font-medium truncate max-w-[72px]">
                      {match.otherUser?.display_name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </section>
          )}

          {/* Conversations */}
          <section className="flex-1 px-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Conversations
            </h2>

            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <MessageCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No conversations yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {matches?.length === 0 
                    ? "Start swiping to get matches and start chatting!"
                    : "Tap on a new match above to start chatting!"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map((chat, index) => (
                  <motion.button
                    key={chat.match_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedChat({
                      matchId: chat.match_id,
                      otherUser: chat.other_user,
                    })}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={chat.other_user.photo_url || "/placeholder.svg"}
                        alt={chat.other_user.display_name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      {/* Online indicator would go here based on last_active_at */}
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold ${chat.unread_count > 0 ? "text-foreground" : "text-foreground"}`}>
                          {chat.other_user.display_name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {chat.last_message ? formatTime(chat.last_message.created_at) : "New match"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate pr-2 flex items-center gap-1 ${
                          chat.unread_count > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                        }`}>
                          {chat.last_message?.content.includes("📷") && (
                            <Camera className="h-3 w-3 shrink-0" />
                          )}
                          {chat.last_message?.content || "Say hello! 👋"}
                        </p>
                        {chat.unread_count > 0 && (
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center font-medium">
                            {chat.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Messages;
