import * as React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  showPercentage?: boolean;
  showGrade?: boolean;
  className?: string;
  thickness?: number;
  children?: React.ReactNode;
}

export function CircularProgress({
  value,
  size = "md",
  color = "#5BC3EB",
  showPercentage = true,
  showGrade = false,
  className,
  thickness = 2.8,
  children,
}: CircularProgressProps) {
  const sizesMap = {
    sm: "w-[70px] h-[70px]",
    md: "w-[120px] h-[120px]",
    lg: "w-[180px] h-[180px]",
  };

  const fontSizeMap = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl",
  };
  
  const scoreFontMap = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const getGrade = (score: number): string => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    if (score >= 50) return "E";
    return "F";
  };

  const getGradeModifier = (grade: string): string => {
    const score = value;
    
    if (grade === "A") {
      if (score >= 97) return "+";
      if (score < 93) return "-";
    } else if (grade !== "F") {
      if (score % 10 >= 7) return "+";
      if (score % 10 < 3) return "-";
    }
    
    return "";
  };
  
  const getColorForGrade = (): string => {
    if (value >= 90) return "#10B981"; // green
    if (value >= 70) return "#F59E0B"; // yellow/amber
    return "#EF4444"; // red
  };

  const grade = getGrade(value);
  const gradeModifier = getGradeModifier(grade);
  const gradeDisplay = `${grade}${gradeModifier}`;
  
  // Use provided color or fallback to grade-based color
  const strokeColor = color.startsWith("#") ? color : getColorForGrade();
  const textColor = color.startsWith("#") ? color : getColorForGrade();

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        sizesMap[size],
        className
      )}
    >
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        {/* Background circle */}
        <path
          className="fill-none"
          style={{ stroke: "#EDE6E3", strokeWidth: thickness }}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        {/* Progress circle */}
        <path
          className="fill-none"
          style={{ 
            stroke: strokeColor, 
            strokeWidth: thickness,
            strokeLinecap: "round"
          }}
          strokeDasharray={`${value}, 100`}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children ? (
          children
        ) : (
          <>
            {showGrade && (
              <div 
                className={cn(fontSizeMap[size], "font-bold")}
                style={{ color: textColor }}
              >
                {gradeDisplay}
              </div>
            )}
            {showPercentage && (
              <div 
                className={cn(scoreFontMap[size], "font-medium text-[#36382E]/70")}
              >
                {value}/100
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
