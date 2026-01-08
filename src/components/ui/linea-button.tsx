import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const lineaButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-soft hover:shadow-card hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border-2 border-primary/20 bg-transparent text-foreground hover:border-primary/40 hover:bg-accent/50",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-accent/50",
        link:
          "text-primary underline-offset-4 hover:underline",
        hero:
          "gradient-primary text-primary-foreground shadow-card hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98]",
        soft:
          "bg-linea-lavender-soft text-accent-foreground hover:bg-accent",
        apple:
          "bg-foreground text-background hover:bg-foreground/90",
        google:
          "border border-border bg-card text-foreground shadow-soft hover:bg-muted",
      },
      size: {
        default: "h-12 px-6 text-base",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-8 text-lg",
        xl: "h-16 px-10 text-xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LineaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof lineaButtonVariants> {
  asChild?: boolean;
}

const LineaButton = React.forwardRef<HTMLButtonElement, LineaButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(lineaButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
LineaButton.displayName = "LineaButton";

export { LineaButton, lineaButtonVariants };
