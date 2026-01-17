"use client";

import { motion } from "motion/react";

export function WorkflowSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-5 md:px-4 sm:px-6 lg:px-8 border-b border-neutral-700">
      <div className="w-[76.75rem] max-w-[calc(100vw-2.5rem)] md:max-w-[calc(100vw-2rem)] mx-auto">
        <div className="mb-8 sm:mb-10 md:mb-12 px-4 md:px-0">
          <h2 className="text-xs sm:text-sm font-medium text-[#A78BFA] mb-3 sm:mb-4">Workflow</h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold text-foreground mb-3 sm:mb-4">
            Seamless Integration Workflow
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            StackPatch seamlessly integrates authentication into your Next.js app with zero configuration.
            Watch how it connects all the pieces together.
          </p>
        </div>

        <div className="p-4 -top-10 relative w-full max-w-none">
          {/* Dotted background pattern */}

          {/* Workflow Visualization - Desktop */}
          <div className="relative mx-auto  h-full min-h-80 max-w-[67rem] grid-cols-2 p-4 lg:grid hidden md:block">
            {/* Left Column - Services */}
            <div className="flex items-center mt-20 justify-between">
              <div className="flex flex-col gap-10">
                {/* Next.js */}
                <div className="relative flex items-center gap-2">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-foreground"
                  >
                    <path
                      d="M13.3333 3.1665H2.66659C1.93021 3.1665 1.33325 3.76346 1.33325 4.49984V12.4998C1.33325 13.2362 1.93021 13.8332 2.66659 13.8332H13.3333C14.0696 13.8332 14.6666 13.2362 14.6666 12.4998V4.49984C14.6666 3.76346 14.0696 3.1665 13.3333 3.1665Z"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 5.8335H4.00583"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.66675 5.8335H6.67258"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.33325 5.8335H9.33909"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-foreground text-sm font-medium">Next.js App</span>
                  {/* Animated connecting line */}
                  <svg
                    width="312"
                    height="33"
                    viewBox="0 0 312 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-2 -right-[336px]"
                  >
                    <line
                      x1="0.5"
                      y1="1"
                      x2="311.5"
                      y2="1"
                      stroke="var(--border)"
                      strokeLinecap="round"
                    />
                    <line
                      x1="311.5"
                      y1="1"
                      x2="311.5"
                      y2="32"
                      stroke="var(--border)"
                      strokeLinecap="round"
                    />
                    <line
                      x1="0.5"
                      y1="1"
                      x2="311.5"
                      y2="1"
                      stroke="url(#line-one-gradient)"
                      strokeLinecap="round"
                    />
                    <defs>
                      <motion.linearGradient
                        gradientUnits="userSpaceOnUse"
                        id="line-one-gradient"
                        y1="1"
                        y2="0"
                        animate={{
                          x1: ["-20%", "120%"],
                          x2: ["0%", "140%"],
                        }}
                        transition={{
                          duration: 1.6,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <stop stopColor="var(--border)" />
                        <stop offset="0.33" stopColor="#EF4444" />
                        <stop offset="0.66" stopColor="#EF4444" />
                        <stop offset="1" stopColor="var(--border)" />
                      </motion.linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Better Auth */}
                <div className="relative flex items-center gap-2">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-foreground"
                  >
                    <path
                      d="M10.6667 12.5L14.6667 8.5L10.6667 4.5"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.33325 4.5L1.33325 8.5L5.33325 12.5"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-foreground text-sm font-medium">Better Auth</span>
                  {/* Animated connecting line */}
                  <svg
                    width="323"
                    height="2"
                    viewBox="0 0 323 2"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-2 -right-[347px]"
                  >
                    <line
                      x1="0.5"
                      y1="1"
                      x2="322.5"
                      y2="1"
                      stroke="var(--border)"
                      strokeLinecap="round"
                    />
                    <line
                      x1="0.5"
                      y1="1"
                      x2="322.5"
                      y2="1"
                      stroke="url(#line-two-gradient)"
                      strokeLinecap="round"
                    />
                    <defs>
                      <motion.linearGradient
                        gradientUnits="userSpaceOnUse"
                        id="line-two-gradient"
                        x1="42.36267%"
                        x2="59.86816%"
                        y1="1"
                        y2="0"
                        animate={{
                          x1: ["-20%", "120%"],
                          x2: ["0%", "140%"],
                        }}
                        transition={{
                          duration: 1.9,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <stop stopColor="var(--border)" />
                        <stop offset="0.33" stopColor="#3B82F6" />
                        <stop offset="0.66" stopColor="#3B82F6" />
                        <stop offset="1" stopColor="var(--border)" />
                      </motion.linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Auth Providers */}
                <div className="relative flex items-center gap-2">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-foreground"
                  >
                    <path
                      d="M9.22125 11.5453C9.35894 11.6085 9.51405 11.6229 9.66105 11.5862C9.80804 11.5495 9.93814 11.4638 10.0299 11.3433L10.2666 11.0333C10.3908 10.8677 10.5518 10.7333 10.737 10.6407C10.9221 10.5481 11.1263 10.4999 11.3333 10.4999H13.3333C13.6869 10.4999 14.026 10.6404 14.2761 10.8904C14.5261 11.1405 14.6666 11.4796 14.6666 11.8333V13.8333C14.6666 14.1869 14.5261 14.526 14.2761 14.7761C14.026 15.0261 13.6869 15.1666 13.3333 15.1666C10.1507 15.1666 7.09841 13.9023 4.84797 11.6519C2.59753 9.40143 1.33325 6.34918 1.33325 3.16659C1.33325 2.81296 1.47373 2.47382 1.72378 2.22378C1.97382 1.97373 2.31296 1.83325 2.66659 1.83325H4.66659C5.02021 1.83325 5.35935 1.97373 5.60939 2.22378C5.85944 2.47382 5.99992 2.81296 5.99992 3.16659V5.16659C5.99992 5.37358 5.95173 5.57773 5.85915 5.76287C5.76658 5.94801 5.63218 6.10906 5.46658 6.23325L5.15458 6.46725C5.0322 6.5607 4.94593 6.69364 4.91045 6.84349C4.87496 6.99333 4.89244 7.15084 4.95992 7.28925C5.87104 9.13983 7.36953 10.6364 9.22125 11.5453Z"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-foreground text-sm font-medium">Auth Providers</span>
                  {/* Animated connecting line */}
                  <motion.svg
                    width="326"
                    height="32"
                    viewBox="0 0 326 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute -right-[350px] bottom-2"

                  >
                    <line y1="31" x2="325" y2="31" stroke="var(--border)" />
                    <line
                      x1="325.5"
                      y1="31"
                      x2="325.5"
                      y2="1"
                      stroke="var(--border)"
                      strokeLinecap="round"
                    />
                    <line
                      y1="31"
                      x2="325"
                      y2="31"
                      stroke="url(#line-three-gradient)"
                    />
                    <defs>
                      <motion.linearGradient
                        id="line-three-gradient"
                        gradientUnits="userSpaceOnUse"
                        y1="1"
                        y2="0"
                        animate={{
                          x1: ["-20%", "120%"],
                          x2: ["0%", "140%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <stop stopColor="var(--border)" offset="0%" />
                        <stop stopColor="#facc15" offset="33%" />
                        <stop stopColor="#f59e42" offset="66%" />
                        <stop stopColor="var(--border)" offset="100%" />
                      </motion.linearGradient>
                    </defs>
                  </motion.svg>
                </div>
              </div>
            </div>

            {/* Right Column - StackPatch Hub */}
            <div className="relative h-16 w-16 overflow-hidden rounded-md bg-card border border-border p-px -ml-20 shadow-xl top-32">
              {/* Spinning gradient rings */}
              <motion.div
                className="absolute inset-0 scale-[1.4] rounded-full bg-conic [background-image:conic-gradient(at_center,transparent,#EF4444_20%,transparent_30%)]"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute inset-0 scale-[1.4] rounded-full [background-image:conic-gradient(at_center,transparent,#3B82F6_20%,transparent_30%)]"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1,
                }}
              />
              <div className="relative z-20 flex h-full w-full items-center justify-center rounded-[5px] bg-card">
              <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
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
              </div>
            </div>

            {/* Connected Badge and Services */}
            <div className="left-125 relative  -top-26  flex  items-center justify-start">
              {/* Horizontal line */}
              <svg
                width="314"
                height="2"
                viewBox="0 0 314 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="0.5"
                  y1="1"
                  x2="313.5"
                  y2="1"
                  stroke="var(--border)"
                  strokeLinecap="round"
                />
                <line
                  x1="0.5"
                  y1="1"
                  x2="313.5"
                  y2="1"
                  stroke="url(#horizontal-line-gradient)"
                  strokeLinecap="round"
                />
                <defs>
                  <motion.linearGradient
                    id="horizontal-line-gradient"
                    gradientUnits="userSpaceOnUse"
                    y1="0"
                    y2="1"
                    animate={{
                      x1: ["-20%", "120%"],
                      x2: ["0%", "140%"],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 1,
                    }}
                  >
                    <stop stopColor="var(--border)" />
                    <stop offset="0.5" stopColor="#A78BFA" />
                    <stop offset="1" stopColor="var(--border)" />
                  </motion.linearGradient>
                </defs>
              </svg>

              {/* Connected Badge */}
              <div className="relative flex flex-col items-center gap-2">
                <span className="relative z-20 rounded-sm border border-primary bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-[#A78BFA]"
                    initial={{
                      width: "100%",
                    }}

                  />
                  <span className="relative z-10">Connected</span>
                </span>

              </div>

              {/* Connecting Lines from Horizontal Line to Output Cards */}


              {/* Output Cards - Code Changes & Auth UI */}
              <div className="absolute -top-50 right-10 flex flex-col z-0">
                {/* Code Changes Card - Small inner card only */}
                <div className="relative z-20 p-0.5 rounded-lg w-[200px] overflow-hidden">
                <motion.div
                className="absolute inset-0 scale-[1.4] rounded-full [background-image:conic-gradient(at_center,transparent,#3B82F6_20%,transparent_30%)]"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1,
                }}
              />
                  <div className="relative z-10 rounded-lg shadow-xl bg-white dark:bg-muted bg-gradient-to-br from-white/5 to-65% p-3 font-mono text-xs ring-[0.25rem] ring-background/50">
                    <div className="text-muted-foreground mb-1.5 text-[10px]">app/layout.tsx</div>
                    <div className="space-y-0.5" style={{ color: "#A78BFA" }}>
                      <div className="text-[10px]">+ AuthWrapper</div>
                      <div className="text-[10px]">+ Toaster</div>
                    </div>
                    <div className="text-muted-foreground mt-2 mb-1.5 text-[10px]">app/api/auth/</div>
                    <div className="space-y-0.5" style={{ color: "#A78BFA" }}>
                      <div className="text-[10px]">+ [...all]/route.ts</div>
                    </div>
                    <div className="text-muted-foreground mt-2 mb-1.5 text-[10px]">lib/</div>
                    <div className="space-y-0.5" style={{ color: "#A78BFA" }}>
                      <div className="text-[10px]">+ auth.ts</div>
                      <div className="text-[10px]">+ protected-routes.ts</div>
                    </div>
                  </div>
                </div>

                {/* Vertical line between cards */}
                <svg
                  width="1"
                  height="104"
                  viewBox="0 0 1 104"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto"
                >
                  <line
                    y1="0.5"
                    x2="0.5"
                    y2="103.5"
                    stroke="var(--border)"
                    strokeLinecap="round"
                  />
                  {/* Upward moving gradient */}
                  <line
                    y1="0.5"
                    x2="0.5"
                    y2="103.5"
                    stroke="url(#vertical-line-upward-gradient)"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                  />
                  {/* Downward moving gradient */}
                  <line
                    y1="0.5"
                    x2="0.5"
                    y2="103.5"
                    stroke="url(#vertical-line-downward-gradient)"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                  />
                  <defs>
                    {/* Upward moving gradient */}
                    <motion.linearGradient
                      id="vertical-line-upward-gradient"
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      x2="0"
                      animate={{
                        y1: ["50%", "0%"],
                        y2: ["100%", "50%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <stop stopColor="var(--border)" />
                      <stop offset="0.5" stopColor="#A78BFA" />
                      <stop offset="1" stopColor="var(--border)" />
                    </motion.linearGradient>
                    {/* Downward moving gradient */}
                    <motion.linearGradient
                      id="vertical-line-downward-gradient"
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      x2="0"
                      animate={{
                        y1: ["50%", "100%"],
                        y2: ["0%", "50%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <stop stopColor="var(--border)" />
                      <stop offset="0.5" stopColor="#A78BFA" />
                      <stop offset="1" stopColor="var(--border)" />
                    </motion.linearGradient>
                  </defs>
                </svg>

                {/* Auth UI Card - Small inner card only */}
                <div className="relative rounded-lg z-30 p-0.5 w-[200px] overflow-hidden">
                <motion.div
                className="absolute inset-0 scale-[1.4] rounded-full bg-conic [background-image:conic-gradient(at_center,transparent,#EF4444_20%,transparent_30%)]"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
                  <div className="mx-auto relative rounded-lg bottom-[0.5px] shadow-xl bg-white dark:bg-muted bg-gradient-to-br from-white/5 to-65% p-3 ring-[0.25rem] ring-background/50">
                    <div className="space-y-1.5">
                      <div className="h-6 rounded bg-background border border-border"></div>
                      <div className="space-y-1">
                        <div className="h-1.5 rounded bg-foreground/20"></div>
                        <div className="h-1.5 rounded bg-foreground/20 w-3/4"></div>
                        <div className="h-4 rounded bg-primary/20 mt-1.5"></div>
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground text-center mt-2">
                      Login & Signup pages
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View - Simplified */}
          <div className="relative mx-auto my-20 sm:my-20 md:my-20 h-full w-full scale-[1.8] sm:scale-[1.5] md:scale-[1.2] lg:hidden overflow-x-auto">
            <div className="flex flex-col items-center gap-8 p-8">
              <div className="text-center">
                <h4 className="text-foreground font-semibold mb-2">Next.js App</h4>
                <div className="w-px h-8 bg-border mx-auto"></div>
              </div>
              <div className="relative h-16 w-16 overflow-hidden rounded-md bg-card border border-border p-px shadow-xl">
                <motion.div
                  className="absolute inset-0 scale-[1.4] rounded-full bg-conic [background-image:conic-gradient(at_center,transparent,#EF4444_20%,transparent_30%)]"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <div className="relative z-20 flex h-full w-full items-center justify-center rounded-[5px] bg-card">
                <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
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
                </div>
              </div>
              <div className="text-center px-4">
                <div className="w-px h-8 bg-border mx-auto mb-2"></div>
                <h4 className="text-foreground text-sm sm:text-base md:text-lg font-semibold text-center px-4">Better Auth Authentication Configured</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
