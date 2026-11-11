"use client";

import Link from "next/link";
import Magnetic from "@/components/immersive/Magnetic";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  external,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    "group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-tight transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer active:scale-[0.97]";

  const variants = {
    primary:
      "bg-primary text-white shadow-[0_10px_40px_-10px_rgba(22,163,74,0.7)] hover:bg-primary-light hover:shadow-[0_18px_50px_-12px_rgba(34,197,94,0.8)]",
    secondary:
      "bg-accent text-white shadow-[0_10px_40px_-10px_rgba(220,38,38,0.7)] hover:bg-accent-light hover:shadow-[0_18px_50px_-12px_rgba(239,68,68,0.8)]",
    outline: "border border-primary/60 text-primary hover:bg-primary hover:text-white hover:border-primary",
    accent:
      "bg-accent text-white shadow-[0_10px_40px_-10px_rgba(220,38,38,0.7)] hover:bg-accent-light hover:shadow-[0_18px_50px_-12px_rgba(239,68,68,0.8)]",
    ghost: "text-primary hover:bg-primary/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-base md:text-lg",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "pointer-events-none opacity-50" : ""}`;

  const content = (
    <>
      {variant !== "ghost" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
        />
      )}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );

  let element: React.ReactNode;
  if (href) {
    element = external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  } else {
    element = (
      <button type={type} onClick={onClick} className={classes} disabled={disabled}>
        {content}
      </button>
    );
  }

  if (variant === "ghost" || size === "sm") return element;
  return <Magnetic strength={0.25}>{element}</Magnetic>;
}
