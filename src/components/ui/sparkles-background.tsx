"use client";
import React, { type ReactNode } from "react";
import { useTheme } from "next-themes";
import { SparklesCore } from "./sparkles";

interface SparklesBackgroundProps {
  children: ReactNode;
  className?: string;
}

export const SparklesBackground = ({ children, className }: SparklesBackgroundProps) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  
  // Use different particle colors for light vs dark mode
  const particleColor = isDarkMode ? "#6b8cba" : "#1a365d";

  return (
    <div className={`relative ${className || ""}`}>
      {/* Sparkles layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <SparklesCore
          id={`sparkles-${Math.random().toString(36).substr(2, 9)}`}
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={60}
          className="w-full h-full"
          particleColor={particleColor}
          speed={0.5}
        />
      </div>
      
      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SparklesBackground;
