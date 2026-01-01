import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "h-12 rounded-2xl border border-border bg-muted px-4 py-3 text-base text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary",
        dating: "h-14 rounded-2xl border border-border bg-muted/50 px-5 py-4 text-base text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary backdrop-blur-sm",
        glass: "h-14 rounded-2xl glass px-5 py-4 text-base text-foreground focus:ring-2 focus:ring-primary/50",
        search: "h-12 rounded-full border border-border bg-muted px-5 py-3 pl-12 text-base text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, icon, iconRight, ...props }, ref) => {
    if (icon || iconRight) {
      return (
        <div className="relative w-full">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant }),
              icon && "pl-12",
              iconRight && "pr-12",
              className
            )}
            ref={ref}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {iconRight}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(inputVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
