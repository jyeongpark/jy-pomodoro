"use client";
import { ButtonHTMLAttributes } from "react";

type Size = "small" | "medium" | "large";
type Varient = "fill" | "outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Varient;
  size: Size;
}

const Button: React.FC<ButtonProps> = ({
  /** 종류 */
  variant,
  /** 사이즈 */
  size,
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "flex justify-center items-center text-foreground rounded hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50";

  const variantStyles: Record<Varient, string> = {
    fill: "bg-primary",
    outline: "border border-primary",
  };

  const sizeStyles: Record<Size, string> = {
    small: "h-6 text-sm font-normal p-2",
    medium: "h-8 text-base font-medium p-3",
    large: "h-10 text-lg font-bold p-4",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
