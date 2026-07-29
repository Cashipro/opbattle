"use client";

import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({
  label,
  className,
  ...props
}: Props) {
  return (
    <div className="space-y-2">

      <label className="text-sm text-gray-300 font-medium">
        {label}
      </label>

      <input
        {...props}
        className={`w-full h-14 rounded-2xl bg-[#111111] border border-[#222] px-5 text-white outline-none transition-all focus:border-[#00FF84] focus:ring-2 focus:ring-[#00FF84]/20 ${className ?? ""}`}
      />

    </div>
  );
}
