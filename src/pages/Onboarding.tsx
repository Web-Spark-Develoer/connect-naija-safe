import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Camera, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCreateProfile, useInterests, useUpdateUserInterests, useUserPhotos } from "@/hooks/useProfile";
import PhotoUploader from "@/components/PhotoUploader";

type GenderType = "male" | "female" | "non_binary" | "other";

interface ProfileFormData {
  display_name: string;
  date_of_birth: string;
  gender: GenderType | "";
  bio: string;
  occupation: string;
  education: string;
  location_city: string;
  looking_for: string[];
  gender_preference: GenderType[];
  min_age_preference: number;
  max_age_preference: number;
  max_distance_km: number;
  selectedInterests: string[];
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const createProfile = useCreateProfile();
  const updateInterests = useUpdateUserInterests();
  const { data: interests } = useInterests();
  const { data: photos = [] } = useUserPhotos();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    display_name: "",
    date_of_birth: "",
    gender: "",
    bio: "",
    occupation: "",
    education: "",
    location_city: "",
    looking_for: ["relationship"],
    gender_preference: [],
    min_age_preference: 18,
    max_age_preference: 40,
    max_distance_km: 50,
    selectedInterests: [],
  });

  const totalSteps = 6;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Not authenticated", variant: "destructive" });
      return;
    }

    if (!formData.display_name || !formData.date_of_birth || !formData.gender) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      await createProfile.mutateAsync({
        display_name: formData.display_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender as GenderType,
        bio: formData.bio || undefined,
        occupation: formData.occupation || undefined,
        education: formData.education || undefined,
        location_city: formData.location_city || undefined,
        looking_for: formData.looking_for,
        gender_preference: formData.gender_preference,
        min_age_preference: formData.min_age_preference,
        max_age_preference: formData.max_age_preference,
        max_distance_km: formData.max_distance_km,
      });

      if (formData.selectedInterests.length > 0) {
        await updateInterests.mutateAsync(formData.selectedInterests);
      }

      toast({ title: "Profile created!", description: "Let's find your match!" });
      navigate("/discover");
    } catch (error: any) {
      toast({ 
        title: "Error creating profile", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGenderPreference = (gender: GenderType) => {
    setFormData(prev => ({
      ...prev,
      gender_preference: prev.gender_preference.includes(gender)
        ? prev.gender_preference.filter(g => g !== gender)
        : [...prev.gender_preference, gender],
    }));
  };

  const toggleInterest = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interestId)
        ? prev.selectedInterests.filter(id => id !== interestId)
        : prev.selectedInterests.length < 5
          ? [...prev.selectedInterests, interestId]
          : prev.selectedInterests,
    }));
  };

  const toggleLookingFor = (type: string) => {
    setFormData(prev => ({
      ...prev,
      looking_for: prev.looking_for.includes(type)
        ? prev.looking_for.filter(t => t !== type)
        : [...prev.looking_for, type],
    }));
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          disabled={step === 1}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        {/* Progress */}
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                i < step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="w-10" />
      </motion.div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              What's your name?
            </h1>
            <p className="text-muted-foreground mb-8">
              This is how you'll appear on NaijaConnect.
            </p>

            <Input
              variant="dating"
              placeholder="Your first name"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              className="text-lg"
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              When's your birthday?
            </h1>
            <p className="text-muted-foreground mb-8">
              You must be 18+ to use NaijaConnect.
            </p>

            <Input
              variant="dating"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              className="text-lg"
            />

            <div className="mt-8">
              <h2 className="font-semibold text-foreground mb-4">I am a...</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "male" as GenderType, label: "Man" },
                  { value: "female" as GenderType, label: "Woman" },
                  { value: "non_binary" as GenderType, label: "Non-binary" },
                  { value: "other" as GenderType, label: "Other" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, gender: option.value })}
                    className={`p-4 rounded-2xl border-2 text-center font-medium transition-all ${
                      formData.gender === option.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Who are you looking for?
            </h1>
            <p className="text-muted-foreground mb-8">
              Select who you'd like to meet.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { value: "male" as GenderType, label: "Men" },
                { value: "female" as GenderType, label: "Women" },
                { value: "non_binary" as GenderType, label: "Non-binary" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleGenderPreference(option.value)}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-medium transition-all flex items-center justify-between ${
                    formData.gender_preference.includes(option.value)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {option.label}
                  {formData.gender_preference.includes(option.value) && (
                    <Check className="h-5 w-5" />
                  )}
                </button>
              ))}
            </div>

            <h2 className="font-semibold text-foreground mb-4">What are you looking for?</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "relationship", label: "Relationship" },
                { value: "casual", label: "Casual" },
                { value: "friendship", label: "Friendship" },
                { value: "networking", label: "Networking" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleLookingFor(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.looking_for.includes(option.value)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Pick your interests
            </h1>
            <p className="text-muted-foreground mb-8">
              Select up to 5 things you love. ({formData.selectedInterests.length}/5)
            </p>

            <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto">
              {interests?.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    formData.selectedInterests.includes(interest.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {interest.icon && <span>{interest.icon}</span>}
                  {interest.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Add your photos
            </h1>
            <p className="text-muted-foreground mb-8">
              Add at least 1 photo to continue. More photos = more matches!
            </p>

            <PhotoUploader photos={photos} maxPhotos={6} showLabels={false} />
          </motion.div>
        )}

        {step === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Almost done!
            </h1>
            <p className="text-muted-foreground mb-8">
              Add a bio and some details about yourself.
            </p>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Bio (optional)
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell people about yourself..."
                  className="w-full p-4 rounded-2xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[120px] resize-none"
                  maxLength={500}
                />
                <span className="text-xs text-muted-foreground">{formData.bio.length}/500</span>
              </div>

              <Input
                variant="dating"
                placeholder="Your occupation"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              />

              <Input
                variant="dating"
                placeholder="Your education"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              />

              <Input
                variant="dating"
                placeholder="Your city (e.g., Lagos, Abuja)"
                icon={<MapPin className="h-5 w-5" />}
                value={formData.location_city}
                onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Button */}
      <div className="mt-auto pt-6">
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          onClick={handleNext}
          disabled={
            isLoading ||
            (step === 1 && !formData.display_name) ||
            (step === 2 && (!formData.date_of_birth || !formData.gender)) ||
            (step === 3 && formData.gender_preference.length === 0) ||
            (step === 5 && photos.length === 0)
          }
        >
          {isLoading ? "Creating profile..." : step === totalSteps ? "Let's Go!" : "Continue"}
          {!isLoading && <ArrowRight className="h-5 w-5 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
