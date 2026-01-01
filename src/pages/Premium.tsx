import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Crown, 
  Heart, 
  Star, 
  Eye, 
  Zap, 
  RotateCcw, 
  MessageCircle,
  Shield,
  Sparkles,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "₦0",
    period: "forever",
    features: [
      { text: "10 swipes per day", included: true },
      { text: "1 super like per day", included: true },
      { text: "Basic matching", included: true },
      { text: "See who liked you", included: false },
      { text: "Unlimited swipes", included: false },
      { text: "Rewind last swipe", included: false },
      { text: "Priority visibility", included: false },
    ],
    popular: false,
  },
  {
    id: "gold",
    name: "Gold",
    price: "₦4,999",
    period: "per month",
    features: [
      { text: "Unlimited swipes", included: true },
      { text: "5 super likes per day", included: true },
      { text: "See who liked you", included: true },
      { text: "Rewind last swipe", included: true },
      { text: "1 free boost per month", included: true },
      { text: "Advanced filters", included: true },
      { text: "Priority messaging", included: false },
    ],
    popular: true,
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "₦9,999",
    period: "per month",
    features: [
      { text: "Everything in Gold", included: true },
      { text: "Unlimited super likes", included: true },
      { text: "Message before matching", included: true },
      { text: "Priority visibility", included: true },
      { text: "Weekly boosts", included: true },
      { text: "Incognito mode", included: true },
      { text: "Premium badge", included: true },
    ],
    popular: false,
  },
];

const featureIcons: Record<string, any> = {
  "Unlimited swipes": Heart,
  "5 super likes per day": Star,
  "See who liked you": Eye,
  "Rewind last swipe": RotateCcw,
  "1 free boost per month": Zap,
  "Advanced filters": Shield,
  "Priority messaging": MessageCircle,
  "Message before matching": MessageCircle,
  "Priority visibility": Sparkles,
  "Weekly boosts": Zap,
  "Incognito mode": Eye,
  "Premium badge": Crown,
  "Unlimited super likes": Star,
};

const Premium = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("gold");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="px-4 py-4 pt-safe flex items-center gap-4">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-lg font-bold text-foreground flex-1">
          Upgrade
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-secondary to-secondary-glow shadow-glow-secondary mb-6"
          >
            <Crown className="h-10 w-10 text-secondary-foreground" />
          </motion.div>
          
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">
            Unlock <span className="text-gradient-secondary">Premium</span>
          </h1>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Get more matches, see who likes you, and find your perfect match faster
          </p>
        </motion.div>

        {/* Plans */}
        <div className="px-4 space-y-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative p-5 rounded-3xl cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? plan.id === "gold" || plan.id === "platinum"
                    ? "premium-card ring-2 ring-secondary"
                    : "bg-primary/10 ring-2 ring-primary"
                  : "bg-muted/50 hover:bg-muted"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="premium-badge">Most Popular</span>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    plan.id === "platinum"
                      ? "bg-gradient-to-br from-secondary to-secondary-glow"
                      : plan.id === "gold"
                      ? "bg-gradient-to-br from-secondary/80 to-secondary"
                      : "bg-primary/20"
                  }`}>
                    <Crown className={`h-6 w-6 ${
                      plan.id === "free" ? "text-primary" : "text-secondary-foreground"
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{plan.period}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-display font-bold text-2xl ${
                    plan.id !== "free" ? "text-gradient-secondary" : "text-foreground"
                  }`}>
                    {plan.price}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {plan.features.slice(0, 4).map((feature, featureIndex) => {
                  const Icon = featureIcons[feature.text] || Check;
                  return (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        feature.included 
                          ? plan.id !== "free" ? "bg-secondary/20" : "bg-primary/20"
                          : "bg-muted"
                      }`}>
                        {feature.included ? (
                          <Check className={`h-3 w-3 ${
                            plan.id !== "free" ? "text-secondary" : "text-primary"
                          }`} />
                        ) : (
                          <span className="w-1.5 h-0.5 bg-muted-foreground rounded" />
                        )}
                      </div>
                      <span className={`text-sm ${
                        feature.included ? "text-foreground" : "text-muted-foreground line-through"
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Selected indicator */}
              <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedPlan === plan.id
                  ? plan.id !== "free" 
                    ? "border-secondary bg-secondary"
                    : "border-primary bg-primary"
                  : "border-border"
              }`}>
                {selectedPlan === plan.id && (
                  <Check className="h-4 w-4 text-foreground" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-6 py-8"
        >
          <h3 className="font-display font-bold text-lg text-foreground mb-4 text-center">
            Premium Benefits
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Heart, label: "More Matches", value: "3x" },
              { icon: Eye, label: "Profile Views", value: "5x" },
              { icon: Star, label: "Super Likes", value: "∞" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                className="text-center p-4 rounded-2xl bg-muted/50"
              >
                <stat.icon className="h-6 w-6 text-secondary mx-auto mb-2" />
                <p className="font-display font-bold text-xl text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-lg border-t border-border">
        <Button
          variant={selectedPlan === "free" ? "hero" : "premium"}
          size="xl"
          className="w-full"
        >
          {selectedPlan === "free" ? (
            "Continue with Free"
          ) : (
            <>
              <Crown className="h-5 w-5 mr-2" />
              Upgrade to {plans.find(p => p.id === selectedPlan)?.name}
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          Cancel anytime. Secure payment powered by Paystack
        </p>
      </div>
    </div>
  );
};

export default Premium;
