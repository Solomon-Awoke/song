"use client";

import { useMemo } from "react";

interface PasswordStrengthProps {
  password: string;
}

type StrengthLevel = "empty" | "weak" | "medium" | "strong";

function getStrength(password: string): StrengthLevel {
  if (!password) return "empty";
  if (password.length < 6) return "weak";
  if (password.length < 10) return "medium";
  return "strong";
}

const config: Record<
  StrengthLevel,
  { label: string; color: string; barColor: string; width: string }
> = {
  empty: {
    label: "",
    color: "text-gray-500",
    barColor: "bg-gray-600",
    width: "w-0",
  },
  weak: {
    label: "Weak",
    color: "text-red-accent",
    barColor: "bg-red-accent",
    width: "w-1/3",
  },
  medium: {
    label: "Medium",
    color: "text-warning",
    barColor: "bg-warning",
    width: "w-2/3",
  },
  strong: {
    label: "Strong",
    color: "text-success",
    barColor: "bg-success",
    width: "w-full",
  },
};

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const level = useMemo(() => getStrength(password), [password]);
  const { label, color, barColor, width } = config[level];

  if (level === "empty") return null;

  return (
    <div className="mt-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-in-out ${barColor} ${width}`}
        />
      </div>
      <p className={`mt-1 text-xs font-medium transition-colors duration-300 ${color}`}>
        {label}
      </p>
    </div>
  );
}
