import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-2xl",
        outline: "border-2 border-border bg-transparent text-foreground hover:bg-muted rounded-2xl",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-2xl",
        ghost: "hover:bg-muted hover:text-foreground rounded-2xl",
        link: "text-primary underline-offset-4 hover:underline",
        // Dating app specific variants
        hero: "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-full shadow-glow-primary hover:shadow-[0_0_48px_hsla(168,84%,32%,0.6)] hover:-translate-y-0.5",
        "hero-secondary": "bg-gradient-to-r from-secondary to-secondary-glow text-secondary-foreground rounded-full shadow-glow-secondary hover:shadow-[0_0_48px_hsla(350,89%,60%,0.6)] hover:-translate-y-0.5",
        "hero-outline": "border-2 border-foreground/20 bg-transparent text-foreground hover:bg-foreground/10 rounded-full backdrop-blur-sm",
        action: "rounded-full bg-card border border-border shadow-card hover:scale-105 active:scale-95",
        "action-like": "rounded-full bg-gradient-to-br from-secondary to-secondary-glow text-secondary-foreground shadow-glow-secondary hover:scale-110 active:scale-95",
        "action-dislike": "rounded-full bg-card border border-border text-muted-foreground shadow-card hover:scale-110 hover:border-destructive hover:text-destructive active:scale-95",
        "action-superlike": "rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow-primary hover:scale-110 active:scale-95",
        glass: "glass rounded-2xl text-foreground hover:bg-muted/40",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-4 text-lg",
        xl: "h-16 px-10 py-5 text-xl",
        icon: "h-12 w-12",
        "icon-sm": "h-10 w-10",
        "icon-lg": "h-14 w-14",
        "icon-xl": "h-16 w-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
