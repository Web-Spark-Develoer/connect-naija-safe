import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Settings, 
  CheckCircle2, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  ChevronRight,
  LogOut,
  Shield,
  Crown,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUserPhotos, useUserInterests, useInterests, useUpdateProfile } from "@/hooks/useProfile";
import PhotoUploader from "@/components/PhotoUploader";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: photos } = useUserPhotos();
  const { data: userInterests } = useUserInterests();
  const { data: allInterests } = useInterests();
  const updateProfile = useUpdateProfile();
  
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      toast({
        title: "Error signing out",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  // Get interest names from IDs
  const userInterestNames = userInterests?.map(ui => {
    const interest = allInterests?.find(i => i.id === ui.interest_id);
    return interest ? { ...interest } : null;
  }).filter(Boolean) || [];

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Profile not found</h2>
        <p className="text-muted-foreground mb-4">Please complete your profile setup.</p>
        <Button variant="hero" onClick={() => navigate("/onboarding")}>
          Set Up Profile
        </Button>
      </div>
    );
  }

  const primaryPhoto = photos?.find(p => p.is_primary) || photos?.[0];

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      {/* Header */}
      <header className="px-4 py-4 pt-safe flex justify-between items-center">
        <span className="text-muted-foreground cursor-pointer" onClick={() => navigate(-1)}>
          Cancel
        </span>
        <h1 className="font-display text-lg font-bold text-foreground">Edit Profile</h1>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      {/* Subscription Status */}
      {profile.subscription_tier !== "free" && (
        <div className="mx-4 mb-4 p-3 rounded-2xl bg-gradient-to-r from-secondary/20 to-primary/20 flex items-center gap-3">
          <Crown className="h-5 w-5 text-secondary" />
          <span className="font-medium text-foreground capitalize">{profile.subscription_tier} Member</span>
        </div>
      )}

      {/* Verification Status */}
      <div className="mx-4 mb-4 p-3 rounded-2xl bg-muted/50 flex items-center gap-3">
        <Shield className={`h-5 w-5 ${profile.is_verified ? "text-primary" : "text-muted-foreground"}`} />
        <div className="flex-1">
          <span className="font-medium text-foreground">
            {profile.is_verified ? "Verified Profile" : "Get Verified"}
          </span>
          {!profile.is_verified && (
            <p className="text-xs text-muted-foreground">Increase matches by 30%</p>
          )}
        </div>
        {profile.is_verified ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      {/* Photos Section */}
      <section className="px-4 mb-6">
        <PhotoUploader photos={photos || []} maxPhotos={6} />
      </section>

      {/* About Me */}
      <section className="px-4 mb-6">
        <h2 className="font-semibold text-foreground mb-3">About Me</h2>
        <div className="p-4 rounded-2xl bg-muted/50 border border-border">
          <p className="text-foreground mb-2">
            {profile.bio || "No bio yet. Add one to help people know you better!"}
          </p>
          <span className="text-xs text-muted-foreground">{profile.bio?.length || 0}/500</span>
        </div>
      </section>

      {/* Basics */}
      <section className="px-4 mb-6">
        <h2 className="font-semibold text-foreground mb-3">Basics</h2>
        <div className="space-y-3">
          {profile.occupation && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Occupation</p>
                <p className="text-foreground">{profile.occupation}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          )}

          {profile.education && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Education</p>
                <p className="text-foreground">{profile.education}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          )}

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
              <p className="text-foreground">{profile.location_city || "Not set"}</p>
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
          {userInterestNames.map((interest: any) => (
            <span key={interest.id} className="interest-tag">
              {interest.icon && <span className="mr-1">{interest.icon}</span>}
              {interest.name}
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
              {["male", "female", "non_binary"].map((option) => {
                const label = option === "male" ? "Men" : option === "female" ? "Women" : "Everyone";
                const isSelected = profile.gender_preference?.includes(option);
                return (
                  <button
                    key={option}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Age Range</p>
              <span className="text-foreground font-medium">
                {profile.min_age_preference} - {profile.max_age_preference}
              </span>
            </div>
            <div className="h-1 bg-muted rounded-full relative">
              <div 
                className="absolute h-full bg-primary rounded-full" 
                style={{
                  left: `${((profile.min_age_preference - 18) / 52) * 100}%`,
                  right: `${100 - ((profile.max_age_preference - 18) / 52) * 100}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Maximum Distance</p>
              <span className="text-foreground font-medium">{profile.max_distance_km} km</span>
            </div>
            <div className="h-1 bg-muted rounded-full relative">
              <div 
                className="absolute left-0 h-full bg-primary rounded-full"
                style={{ width: `${(profile.max_distance_km / 100) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Daily Stats */}
      <section className="px-4 mb-6">
        <h2 className="font-semibold text-foreground mb-3">Today's Stats</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-muted/50 border border-border text-center">
            <p className="text-2xl font-bold text-foreground">{profile.daily_swipes_remaining}</p>
            <p className="text-xs text-muted-foreground">Swipes remaining</p>
          </div>
          <div className="p-4 rounded-2xl bg-muted/50 border border-border text-center">
            <p className="text-2xl font-bold text-foreground">{profile.daily_super_likes_remaining}</p>
            <p className="text-xs text-muted-foreground">Super Likes</p>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="px-4 pb-4 space-y-3">
        <Button variant="hero" size="xl" className="w-full">
          Save Changes
        </Button>
        
        <Button 
          variant="outline" 
          size="xl" 
          className="w-full text-destructive hover:text-destructive"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <LogOut className="h-5 w-5 mr-2" />
          )}
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
