import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Shield,
  Eye,
  HelpCircle,
  FileText,
  Trash2,
  LogOut,
  Crown,
  User,
  MapPin,
  Lock,
  Smartphone,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

interface SettingItemProps {
  icon: any;
  label: string;
  description?: string;
  onClick?: () => void;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  isPremium?: boolean;
  danger?: boolean;
}

const SettingItem = ({
  icon: Icon,
  label,
  description,
  onClick,
  hasSwitch,
  switchValue,
  onSwitchChange,
  isPremium,
  danger,
}: SettingItemProps) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-colors ${
      danger ? "hover:bg-destructive/10" : "hover:bg-muted/50"
    }`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
      danger ? "bg-destructive/10" : isPremium ? "bg-secondary/10" : "bg-muted"
    }`}>
      <Icon className={`h-5 w-5 ${
        danger ? "text-destructive" : isPremium ? "text-secondary" : "text-muted-foreground"
      }`} />
    </div>
    <div className="flex-1 text-left">
      <div className="flex items-center gap-2">
        <span className={`font-medium ${danger ? "text-destructive" : "text-foreground"}`}>
          {label}
        </span>
        {isPremium && <span className="premium-badge text-[10px]">Premium</span>}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    {hasSwitch ? (
      <Switch checked={switchValue} onCheckedChange={onSwitchChange} />
    ) : (
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    )}
  </motion.button>
);

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { data: profile } = useProfile();
  
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [notifications, setNotifications] = useState({
    matches: true,
    messages: true,
    likes: true,
    promotions: false,
  });
  const [privacy, setPrivacy] = useState({
    showOnlineStatus: true,
    showDistance: true,
    incognitoMode: false,
  });

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

  const handleDeleteAccount = () => {
    toast({
      title: "Delete Account",
      description: "Please contact support to delete your account.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      {/* Header */}
      <header className="px-4 py-4 pt-safe flex items-center gap-4 border-b border-border">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-lg font-bold text-foreground">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Account Section */}
        <section className="p-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-4">Account</h2>
          <div className="space-y-1">
            <SettingItem
              icon={User}
              label="Edit Profile"
              description="Update your photos, bio, and interests"
              onClick={() => navigate("/profile")}
            />
            <SettingItem
              icon={MapPin}
              label="Discovery Settings"
              description="Location, age range, and preferences"
              onClick={() => navigate("/discovery-settings")}
            />
            <SettingItem
              icon={Shield}
              label="Verification"
              description={profile?.is_verified ? "Verified ✓" : "Get verified badge"}
              onClick={() => navigate("/verification")}
            />
            <SettingItem
              icon={Crown}
              label="NaijaConnect Premium"
              description={profile?.subscription_tier === "free" ? "Upgrade now" : `${profile?.subscription_tier} member`}
              onClick={() => navigate("/premium")}
              isPremium
            />
          </div>
        </section>

        {/* Notifications Section */}
        <section className="p-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-4">Notifications</h2>
          <div className="space-y-1">
            <SettingItem
              icon={Bell}
              label="New Matches"
              hasSwitch
              switchValue={notifications.matches}
              onSwitchChange={(value) => setNotifications({ ...notifications, matches: value })}
            />
            <SettingItem
              icon={Bell}
              label="Messages"
              hasSwitch
              switchValue={notifications.messages}
              onSwitchChange={(value) => setNotifications({ ...notifications, messages: value })}
            />
            <SettingItem
              icon={Bell}
              label="Likes"
              hasSwitch
              switchValue={notifications.likes}
              onSwitchChange={(value) => setNotifications({ ...notifications, likes: value })}
            />
            <SettingItem
              icon={Bell}
              label="Promotions & Tips"
              hasSwitch
              switchValue={notifications.promotions}
              onSwitchChange={(value) => setNotifications({ ...notifications, promotions: value })}
            />
          </div>
        </section>

        {/* Privacy Section */}
        <section className="p-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-4">Privacy</h2>
          <div className="space-y-1">
            <SettingItem
              icon={Eye}
              label="Show Online Status"
              hasSwitch
              switchValue={privacy.showOnlineStatus}
              onSwitchChange={(value) => setPrivacy({ ...privacy, showOnlineStatus: value })}
            />
            <SettingItem
              icon={MapPin}
              label="Show Distance"
              hasSwitch
              switchValue={privacy.showDistance}
              onSwitchChange={(value) => setPrivacy({ ...privacy, showDistance: value })}
            />
            <SettingItem
              icon={Lock}
              label="Incognito Mode"
              description="Browse without being seen"
              hasSwitch
              switchValue={privacy.incognitoMode}
              onSwitchChange={(value) => setPrivacy({ ...privacy, incognitoMode: value })}
              isPremium
            />
            <SettingItem
              icon={User}
              label="Blocked Users"
              description="Manage blocked profiles"
              onClick={() => {}}
            />
          </div>
        </section>

        {/* Support Section */}
        <section className="p-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-4">Support</h2>
          <div className="space-y-1">
            <SettingItem
              icon={HelpCircle}
              label="Help Center"
              onClick={() => {}}
            />
            <SettingItem
              icon={FileText}
              label="Terms of Service"
              onClick={() => {}}
            />
            <SettingItem
              icon={Shield}
              label="Privacy Policy"
              description="NDPA Compliant"
              onClick={() => {}}
            />
            <SettingItem
              icon={Smartphone}
              label="App Version"
              description="1.0.0"
            />
          </div>
        </section>

        {/* Danger Zone */}
        <section className="p-4">
          <h2 className="text-sm font-medium text-destructive mb-2 px-4">Danger Zone</h2>
          <div className="space-y-1">
            <SettingItem
              icon={LogOut}
              label="Sign Out"
              onClick={handleSignOut}
              danger
            />
            <SettingItem
              icon={Trash2}
              label="Delete Account"
              description="Permanently delete your data"
              onClick={handleDeleteAccount}
              danger
            />
          </div>
        </section>
      </div>

      {/* Loading overlay for sign out */}
      {isSigningOut && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

export default Settings;
