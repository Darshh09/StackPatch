import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 24 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Stack layers */}
      <rect
        x="4"
        y="8"
        width="20"
        height="4"
        rx="1"
        fill="#A78BFA"
        opacity="0.8"
      />
      <rect
        x="6"
        y="12"
        width="18"
        height="4"
        rx="1"
        fill="#A78BFA"
        opacity="0.6"
      />
      <rect
        x="8"
        y="16"
        width="16"
        height="4"
        rx="1"
        fill="#A78BFA"
        opacity="0.4"
      />

      {/* Patch overlay (diff symbol) */}
      <path
        d="M24 6 L28 10 L24 14 L20 10 Z"
        fill="#06B6D4"
        stroke="#06B6D4"
        strokeWidth="1.5"
      />
      <path
        d="M22 8 L26 8 M24 6 L24 10"
        stroke="#0A0A0A"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Code brackets */}
      <path
        d="M10 22 L8 24 L10 26 M22 22 L24 24 L22 26"
        stroke="#A78BFA"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LogoText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo size={28} />
      <span className="font-heading font-semibold text-lg text-[#A78BFA]">
        StackPatch
      </span>
    </div>
  );
}
