import React from "react";
import { motion } from "framer-motion";
import { theme } from "@/theme/theme";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return `bg-primary text-white hover:bg-primaryDark`;
      case "secondary":
        return `bg-secondary text-white hover:bg-secondaryDark`;
      case "outline":
        return `bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white`;
      default:
        return `bg-primary text-white hover:bg-primaryDark`;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return "px-4 py-2 text-sm";
      case "medium":
        return "px-6 py-3 text-base";
      case "large":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  return (
    //@ts-ignore
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${getVariantStyles()} ${getSizeStyles()} rounded-md font-semibold transition-colors duration-300 ${className}`}
      style={{ fontFamily: theme.fonts.body }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
