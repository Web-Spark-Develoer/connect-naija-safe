import { motion } from "framer-motion";
import { 
  Settings, 
  CheckCircle2, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Edit3,
  Camera,
  Plus,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

import profileMan1 from "@/assets/profile-man-1.jpg";

const interests = ["Afrobeats", "Suya", "Tech", "Football", "Beach", "Amapiano"];

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      {/* Header */}
      <header className="px-4 py-4 pt-safe flex justify-between items-center">
        <span className="text-muted-foreground">Cancel</span>
        <h1 className="font-display text-lg font-bold text-foreground">Edit Profile</h1>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      {/* Photos Section */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">My Photos</h2>
          <span className="text-sm text-primary">4/6 ADDED</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Hold and drag photos to reorder.</p>

        <div className="grid grid-cols-3 gap-3">
          {/* Main Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden col-span-1"
          >
            <img
              src={profileMan1}
              alt="Profile"
              className="h-full w-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
              MAIN
            </div>
            <button className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
              ×
            </button>
          </motion.div>

          {/* Additional Photos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted flex items-center justify-center"
          >
            <img
              src={profileMan1}
              alt="Profile 2"
              className="h-full w-full object-cover"
            />
            <button className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-muted-foreground/50 text-foreground flex items-center justify-center text-sm">
              ×
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted flex items-center justify-center"
          >
            <img
              src={profileMan1}
              alt="Profile 3"
              className="h-full w-full object-cover opacity-80"
            />
            <button className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-muted-foreground/50 text-foreground flex items-center justify-center text-sm">
              ×
            </button>
          </motion.div>

          {/* Empty Slots */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="aspect-[3/4] rounded-2xl border-2 border-dashed border-border flex items-center justify-center hover:border-primary transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Plus className="h-5 w-5 text-primary-foreground" />
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="aspect-[3/4] rounded-2xl border-2 border-dashed border-border flex items-center justify-center hover:border-primary transition-colors"
          >
            <Plus className="h-6 w-6 text-muted-foreground" />
          </motion.button>
        </div>
      </section>

      {/* About Me */}
      <section className="px-4 mb-6">
        <h2 className="font-semibold text-foreground mb-3">About Me</h2>
        <div className="p-4 rounded-2xl bg-muted/50 border border-border">
          <p className="text-foreground mb-2">
            Software engineer by day, amateur Afrobeats DJ by night. Looking for someone to explore new restaurants in VI with. 🇳🇬
          </p>
          <span className="text-xs text-muted-foreground">112/500</span>
        </div>
      </section>

      {/* Basics */}
      <section className="px-4 mb-6">
        <h2 className="font-semibold text-foreground mb-3">Basics</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Job Title</p>
              <p className="text-foreground">Product Designer</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Company</p>
              <p className="text-foreground">Paystack</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">School</p>
              <p className="text-foreground">University of Lagos</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
              <p className="text-foreground">Lekki Phase 1, Lagos</p>
            </div>
            <span className="text-xs text-muted-foreground">(Updates automatically)</span>
          </div>
        </div>
      </section>

      {/* Interests */}
      <section className="px-4 mb-6">
        <h2 className="font-semibold text-foreground mb-2">Interests</h2>
        <p className="text-sm text-muted-foreground mb-4">Pick up to 5 things you love.</p>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <span key={interest} className="interest-tag">
              {interest}
            </span>
          ))}
          <button className="px-4 py-2 rounded-full text-sm font-medium border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
            + Add more
          </button>
        </div>
      </section>

      {/* Preferences */}
      <section className="px-4 mb-6">
        <h2 className="font-semibold text-foreground mb-4">Preferences</h2>
        
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">Show me</p>
            <div className="flex gap-2">
              {["Men", "Women", "Everyone"].map((option) => (
                <button
                  key={option}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    option === "Women"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Age Range</p>
              <span className="text-foreground font-medium">21 - 35</span>
            </div>
            <div className="h-1 bg-muted rounded-full relative">
              <div className="absolute left-[20%] right-[30%] h-full bg-primary rounded-full" />
              <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background" />
              <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Maximum Distance</p>
              <span className="text-foreground font-medium">50 km</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>1km</span>
              <span>100km+</span>
            </div>
            <div className="h-1 bg-muted rounded-full relative mt-2">
              <div className="absolute left-0 w-1/2 h-full bg-primary rounded-full" />
              <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background" />
            </div>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="px-4 pb-4">
        <Button variant="hero" size="xl" className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;
