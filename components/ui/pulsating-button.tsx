"use client";

import React from "react";
import { MdArrowOutward } from "react-icons/md";

import { cn } from "@/lib/utils";

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
  disable?: boolean;
  deleteBtn?: boolean;
}

export default function PulsatingButton({
  className,
  children,
  pulseColor = "#2e2d2d84",
  duration = "3s",
  disable = false,
  deleteBtn = false,
  ...props
}: PulsatingButtonProps) {
  return (
    <button
      className={cn(
        `relative text-center cursor-pointer flex justify-center items-center rounded-lg text-zinc-50 ${deleteBtn ? 'bg-red-500' : 'bg-zinc-800'} ${disable && 'bg-[#6d6c6c8b] cursor-not-allowed'} px-4 py-2`,
        className,
      )}
      style={
        {
          "--pulse-color": deleteBtn ? '#ff6c6c84' : pulseColor,
          "--duration": duration,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="relative z-10 ">{children} </div>
      {!disable && <div className={`absolute top-1/2 left-1/2 size-full rounded-full ${deleteBtn ? 'bg-red-500' : 'bg-zinc-800'} animate-pulse -translate-x-1/2 -translate-y-1/2`} />
      }    </button>
  );
}
