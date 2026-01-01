import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, KeyRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Reset code sent!",
        description: `Check your ${method} for the reset code.`,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center mb-8"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/login")}
          className="mr-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center mb-8"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <KeyRound className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-foreground mb-3">
          Forgot Password?
        </h1>
        <p className="text-muted-foreground max-w-xs mx-auto">
          Don't worry, it happens. Enter your details below to reset your password.
        </p>
      </motion.div>

      {/* Method Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex rounded-2xl bg-muted p-1.5 mb-8"
      >
        <button
          onClick={() => setMethod("email")}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
            method === "email"
              ? "bg-primary text-primary-foreground shadow-glow-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Email
        </button>
        <button
          onClick={() => setMethod("phone")}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
            method === "phone"
              ? "bg-primary text-primary-foreground shadow-glow-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Phone Number
        </button>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {method === "email" ? "Email Address" : "Phone Number"}
          </label>
          <Input
            variant="dating"
            type={method === "email" ? "email" : "tel"}
            placeholder={method === "email" ? "example@email.com" : "+234 XXX XXX XXXX"}
            icon={method === "email" ? <Mail className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>

        <Button
          variant="hero"
          size="xl"
          className="w-full"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Code"}
          {!isLoading && <ArrowLeft className="h-5 w-5 rotate-180" />}
        </Button>
      </motion.form>

      {/* Help Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8"
      >
        <p className="text-muted-foreground mb-4">
          Need more help?{" "}
          <span className="text-primary hover:underline cursor-pointer">Contact Support</span>
        </p>
        <div className="h-px bg-border w-1/3 mx-auto mb-4" />
        <p className="text-muted-foreground">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-foreground font-medium hover:underline"
          >
            Log In
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
