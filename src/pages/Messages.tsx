import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileWoman2 from "@/assets/profile-woman-2.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";

const newMatches = [
  { id: "1", name: "Chinedu", image: profileMan1, online: false },
  { id: "2", name: "Amara", image: profileWoman1, online: true },
  { id: "3", name: "Tunde", image: profileMan2, online: true },
  { id: "4", name: "Zainab", image: profileWoman2, online: false },
];

const conversations = [
  {
    id: "1",
    name: "Chidinma",
    image: profileWoman1,
    lastMessage: "Lol, that's hilarious! 😂 When are yo...",
    time: "2m",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Oluwaseun",
    image: profileMan1,
    lastMessage: "Are we still meeting at the Island?",
    time: "15m",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Nneka",
    image: profileWoman2,
    lastMessage: "📷 Sent a photo",
    time: "1h",
    unread: 0,
    online: true,
  },
  {
    id: "4",
    name: "David",
    image: profileMan2,
    lastMessage: "Nice meeting you too!",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Ify",
    image: profileWoman1,
    lastMessage: "Can't wait to see the pictures.",
    time: "Sun",
    unread: 0,
    online: false,
  },
];

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");

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

      {/* New Matches */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            New Matches
          </h2>
          <button className="text-sm text-primary hover:underline">See all</button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {newMatches.map((match, index) => (
            <motion.button
              key={match.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-2 min-w-[72px]"
            >
              <div className={`relative ${match.online ? "avatar-ring-primary" : "p-[3px]"}`}>
                <img
                  src={match.image}
                  alt={match.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                {match.online && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-background" />
                )}
              </div>
              <span className="text-sm text-foreground font-medium truncate max-w-[72px]">
                {match.name}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Conversations */}
      <section className="flex-1 px-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Conversations
        </h2>

        <div className="space-y-1">
          {conversations.map((chat, index) => (
            <motion.button
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-colors"
            >
              <div className="relative">
                <img
                  src={chat.image}
                  alt={chat.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-background" />
                )}
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-foreground">{chat.name}</h3>
                  <span className="text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate pr-2 flex items-center gap-1">
                    {chat.lastMessage.includes("📷") && <Camera className="h-3 w-3" />}
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center font-medium">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Messages;
