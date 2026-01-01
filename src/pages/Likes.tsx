import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import profileWoman1 from "@/assets/profile-woman-1.jpg";
import profileMan1 from "@/assets/profile-man-1.jpg";
import profileWoman2 from "@/assets/profile-woman-2.jpg";
import profileMan2 from "@/assets/profile-man-2.jpg";

const likes = [
  { id: "1", name: "Amaka", age: 23, image: profileWoman1, matchPercent: 95 },
  { id: "2", name: "Chidi", age: 28, image: profileMan1, matchPercent: 87 },
  { id: "3", name: "Ngozi", age: 25, image: profileWoman2, matchPercent: 82 },
  { id: "4", name: "Kemi", age: 24, image: profileWoman1, matchPercent: 78 },
  { id: "5", name: "Segun", age: 27, image: profileMan2, matchPercent: 91 },
  { id: "6", name: "Yemi", age: 26, image: profileMan1, matchPercent: 85 },
];

const Likes = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      {/* Header */}
      <header className="px-4 py-6 pt-safe">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="h-6 w-6 text-secondary fill-secondary" />
          <h1 className="font-display text-3xl font-bold text-foreground">Likes</h1>
        </div>
        <p className="text-muted-foreground">
          {likes.length} people liked you
        </p>
      </header>

      {/* Upgrade Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mb-6 p-4 rounded-2xl glass"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center">
            <Heart className="h-6 w-6 text-secondary-foreground fill-current" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">See who likes you</h3>
            <p className="text-sm text-muted-foreground">
              Upgrade to Gold to see all your admirers
            </p>
          </div>
        </div>
      </motion.div>

      {/* Likes Grid */}
      <section className="flex-1 px-4">
        <div className="grid grid-cols-2 gap-4">
          {likes.map((person, index) => (
            <motion.button
              key={person.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-[3/4] rounded-3xl overflow-hidden group"
            >
              {/* Blurred image for free users */}
              <img
                src={person.image}
                alt={person.name}
                className="h-full w-full object-cover filter blur-lg scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90" />

              {/* Match Badge */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-xs font-medium">
                {person.matchPercent}% Match
              </div>

              {/* Lock Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full glass flex items-center justify-center">
                  <Heart className="h-8 w-8 text-secondary" />
                </div>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-semibold text-foreground">
                  {person.name}, {person.age}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Likes;
