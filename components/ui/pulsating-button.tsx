"use client";

import React from "react";
import { MdArrowOutward } from "react-icons/md";

import { cn } from "@/lib/utils";

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
}

export default function PulsatingButton({
  className,
  children,
  pulseColor = "#2e2d2d84",
  duration = "3s",
  ...props
}: PulsatingButtonProps) {
  return (
    <button
      className={cn(
        "relative text-center cursor-pointer flex justify-center items-center rounded-lg text-zinc-50 bg-zinc-800 px-4 py-2",
        className,
      )}
      style={
        {
          "--pulse-color": pulseColor,
          "--duration": duration,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="relative z-10 ">{children} </div>
      <div className="absolute top-1/2 left-1/2 size-full rounded-full bg-zinc-800 animate-pulse -translate-x-1/2 -translate-y-1/2" />
    </button>
  );
}
