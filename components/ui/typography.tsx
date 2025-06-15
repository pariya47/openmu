import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TypographyProps {
  children: ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "p" | "large" | "small" | "muted";
  className?: string;
}

export function Typography({ children, variant = "p", className }: TypographyProps) {
  const baseStyles = "font-sans";
  
  const variants = {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight",
    p: "leading-7 [&:not(:first-child)]:mt-6",
    large: "text-lg font-semibold",
    small: "text-sm font-medium leading-none",
    muted: "text-sm text-muted-foreground",
  };

  const Component = variant === "p" ? "p" : variant === "large" || variant === "small" || variant === "muted" ? "p" : variant;

  return (
    <Component className={cn(baseStyles, variants[variant], className)}>
      {children}
    </Component>
  );
}