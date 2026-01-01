import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";

const nigerianCities = [
  "Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", 
  "Kaduna", "Benin City", "Enugu", "Calabar", "Warri"
];

const lookingForOptions = [
  { id: "relationship", label: "Relationship", emoji: "💕" },
  { id: "casual", label: "Casual", emoji: "🔥" },
  { id: "friendship", label: "Friendship", emoji: "🤝" },
  { id: "networking", label: "Networking", emoji: "💼" },
];

const DiscoverySettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [ageRange, setAgeRange] = useState([18, 50]);
  const [distance, setDistance] = useState(50);
  const [genderPreference, setGenderPreference] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [incognitoMode, setIncognitoMode] = useState(false);

  useEffect(() => {
    if (profile) {
      setAgeRange([profile.min_age_preference || 18, profile.max_age_preference || 50]);
      setDistance(profile.max_distance_km || 50);
      setGenderPreference(profile.gender_preference || []);
      setLookingFor(profile.looking_for || []);
      setSelectedCity(profile.location_city || null);
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        min_age_preference: ageRange[0],
        max_age_preference: ageRange[1],
        max_distance_km: distance,
        gender_preference: genderPreference as any,
        looking_for: lookingFor as any,
        location_city: selectedCity,
      });
      toast({
        title: "Settings saved! ✓",
        description: "Your discovery preferences have been updated.",
      });
      navigate(-1);
    } catch (error) {
      toast({
        title: "Failed to save",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const toggleGender = (gender: string) => {
    setGenderPreference((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
    );
  };

  const toggleLookingFor = (option: string) => {
    setLookingFor((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      {/* Header */}
      <header className="px-4 py-4 pt-safe flex items-center gap-4 border-b border-border">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-lg font-bold text-foreground flex-1">
          Discovery Settings
        </h1>
        <Button variant="ghost" onClick={handleSave} disabled={updateProfile.isPending}>
          {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {/* Location */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Location</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {nigerianCities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city === selectedCity ? null : city)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCity === city
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Distance */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Maximum Distance</h2>
            <span className="text-primary font-bold">{distance} km</span>
          </div>
          <Slider
            value={[distance]}
            onValueChange={([value]) => setDistance(value)}
            min={5}
            max={100}
            step={5}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 km</span>
            <span>100 km</span>
          </div>
        </motion.section>

        {/* Age Range */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Age Range</h2>
            <span className="text-primary font-bold">{ageRange[0]} - {ageRange[1]}</span>
          </div>
          <Slider
            value={ageRange}
            onValueChange={setAgeRange}
            min={18}
            max={70}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>18</span>
            <span>70</span>
          </div>
        </motion.section>

        {/* Show Me */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-semibold text-foreground mb-4">Show Me</h2>
          <div className="flex gap-3">
            {[
              { id: "male", label: "Men" },
              { id: "female", label: "Women" },
              { id: "non_binary", label: "Everyone" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => toggleGender(option.id)}
                className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
                  genderPreference.includes(option.id)
                    ? "bg-primary text-primary-foreground shadow-glow-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Looking For */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-semibold text-foreground mb-4">Looking For</h2>
          <div className="grid grid-cols-2 gap-3">
            {lookingForOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleLookingFor(option.id)}
                className={`p-4 rounded-2xl text-left transition-all ${
                  lookingFor.includes(option.id)
                    ? "bg-primary/20 border-2 border-primary"
                    : "bg-muted border-2 border-transparent hover:bg-muted/80"
                }`}
              >
                <span className="text-2xl mb-2 block">{option.emoji}</span>
                <span className={`font-medium ${
                  lookingFor.includes(option.id) ? "text-primary" : "text-foreground"
                }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Advanced Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="font-semibold text-foreground mb-4">Advanced</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50">
              <div>
                <p className="font-medium text-foreground">Only show verified profiles</p>
                <p className="text-sm text-muted-foreground">See only verified users</p>
              </div>
              <Switch
                checked={showOnlyVerified}
                onCheckedChange={setShowOnlyVerified}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/10 border border-secondary/30">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">Incognito Mode</p>
                  <span className="premium-badge">Gold</span>
                </div>
                <p className="text-sm text-muted-foreground">Browse without being seen</p>
              </div>
              <Switch
                checked={incognitoMode}
                onCheckedChange={setIncognitoMode}
              />
            </div>
          </div>
        </motion.section>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          onClick={handleSave}
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </div>
    </div>
  );
};

export default DiscoverySettings;
