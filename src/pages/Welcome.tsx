import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import heroCoupleImage from "@/assets/hero-couple.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroCoupleImage}
          alt="Happy couple"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center pt-12 pb-4"
        >
          <div className="glass px-6 py-3 rounded-full">
            <Logo size="sm" />
          </div>
        </motion.header>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-end px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Naija Love
              <br />
              Starts <span className="text-gradient-secondary italic">Here</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xs mx-auto">
              Connect. Vibe. Date. Join thousands of singles in Lagos, Abuja, and beyond.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <Button
              variant="hero"
              size="xl"
              className="w-full"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>

            <Button
              variant="hero-outline"
              size="xl"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              I have an account
            </Button>
          </motion.div>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            By continuing, you agree to our{" "}
            <span className="text-primary underline cursor-pointer">Terms of Service</span>{" "}
            &{" "}
            <span className="text-primary underline cursor-pointer">Privacy Policy</span>.
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
