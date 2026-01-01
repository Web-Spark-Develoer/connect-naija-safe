import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, CheckCircle2, Shield, Upload, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";

const verificationSteps = [
  {
    id: "selfie",
    title: "Take a Selfie",
    description: "We'll match this with your profile photos",
    icon: Camera,
  },
  {
    id: "pose",
    title: "Pose Match",
    description: "Mimic the pose shown on screen",
    icon: Shield,
  },
  {
    id: "id",
    title: "ID Verification (Optional)",
    description: "Upload a government-issued ID for extra trust",
    icon: Upload,
  },
];

const Verification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const handleCapture = async () => {
    setIsCapturing(true);
    
    // Simulate capture process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const step = verificationSteps[currentStep];
    setCompletedSteps((prev) => [...prev, step.id]);
    setIsCapturing(false);

    if (currentStep < verificationSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      toast({
        title: "Step completed! ✓",
        description: "Moving to next verification step",
      });
    } else {
      toast({
        title: "Verification submitted! 🎉",
        description: "We'll review your verification within 24 hours.",
      });
      navigate("/discover");
    }
  };

  const handleSkip = () => {
    if (currentStep === verificationSteps.length - 1) {
      navigate("/discover");
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const progress = ((currentStep + 1) / verificationSteps.length) * 100;
  const CurrentIcon = verificationSteps[currentStep].icon;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="px-4 py-4 pt-safe flex items-center gap-4">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary-glow"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <span className="text-sm text-muted-foreground">
          {currentStep + 1}/{verificationSteps.length}
        </span>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="sm" />
        </div>

        {/* Title */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Profile Verification</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            {verificationSteps[currentStep].title}
          </h1>
          <p className="text-muted-foreground">
            {verificationSteps[currentStep].description}
          </p>
        </motion.div>

        {/* Camera preview area */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <div className="relative w-64 h-64 rounded-full bg-muted/50 border-4 border-dashed border-primary/30 flex items-center justify-center overflow-hidden">
            {isCapturing ? (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-primary"
              >
                <Loader2 className="h-16 w-16 animate-spin" />
              </motion.div>
            ) : (
              <CurrentIcon className="h-20 w-20 text-muted-foreground" />
            )}

            {/* Scanning effect */}
            {isCapturing && (
              <motion.div
                initial={{ top: 0 }}
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
              />
            )}
          </div>

          {/* Pose guide for step 2 */}
          {currentStep === 1 && !isCapturing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <p className="text-foreground font-medium mb-2">Please smile and look at the camera</p>
              <p className="text-muted-foreground text-sm">
                Make sure your face is well-lit and clearly visible
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Completed steps indicator */}
        <div className="flex justify-center gap-3 mb-8">
          {verificationSteps.map((step, index) => (
            <div
              key={step.id}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                completedSteps.includes(step.id)
                  ? "bg-primary text-primary-foreground"
                  : index === currentStep
                  ? "bg-primary/20 text-primary border-2 border-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {completedSteps.includes(step.id) ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={handleCapture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Processing...
              </>
            ) : currentStep === 0 ? (
              <>
                <Camera className="h-5 w-5 mr-2" />
                Take Selfie
              </>
            ) : currentStep === 1 ? (
              <>
                <Camera className="h-5 w-5 mr-2" />
                Capture Pose
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Upload ID
              </>
            )}
          </Button>

          <Button variant="ghost" size="lg" className="w-full" onClick={handleSkip}>
            {currentStep === verificationSteps.length - 1 ? "Skip for now" : "Skip this step"}
          </Button>
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 rounded-2xl bg-primary/10 border border-primary/20"
        >
          <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Why verify?
          </h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Get a verified badge on your profile</li>
            <li>• Increase your matches by up to 30%</li>
            <li>• Build trust with potential matches</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Verification;
