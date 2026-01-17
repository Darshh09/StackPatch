"use client";

import { motion } from "motion/react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { CheckCircle2, Sparkles, ArrowRight, Copy, Check } from "lucide-react";
import { Logo } from "@/components/logo";
import { ContainerTextFlip } from "@/components/container-text-flip";

interface HeroSectionProps {
  command: string;
  copied: boolean;
  onCopy: () => void;
}

export function HeroSection({ command, copied, onCopy }: HeroSectionProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAscii, setShowAscii] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [terminalSteps, setTerminalSteps] = useState<{ text: string; status: "processing" | "done" }[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText("npm i stackpatch@latest");
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }, []);

  const steps = useMemo(() => [
    "Better-auth configuration",
    "Route protection",
    "Auth pages & UI",
    "Environment setup",
  ], []);

  const goToPreviousPrompt = useCallback(() => {
    if (terminalSteps.length > 0) {
      setTerminalSteps((prev) => prev.slice(0, -1));
    } else if (showSuccess) {
      setShowSuccess(false);
    } else if (showAscii) {
      setShowAscii(false);
    } else if (typedText.length > 0) {
      setTypedText("");
    }
  }, [terminalSteps.length, showSuccess, showAscii, typedText.length]);

  useEffect(() => {
    // Handle keyboard navigation
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "b" || e.key === "B") {
        goToPreviousPrompt();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [goToPreviousPrompt]);

  const startTerminalAnimation = useCallback(() => {
    setIsAnimating(true);
    setShowAscii(false);
    setTypedText("");
    setTerminalSteps([]);
    setShowSuccess(false);

    // Step 1: Type command
    const commandText = "$ npx stackpatch add auth";
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < commandText.length) {
        setTypedText(commandText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          // Step 2: Show ASCII art
          setShowAscii(true);
          setTimeout(() => {
            // Step 3: Show steps one by one with processing animation
            const processStep = (index: number) => {
              if (index >= steps.length) {
                // All steps done, show success
                setTimeout(() => {
                  setShowSuccess(true);
                  setTimeout(() => {
                    setIsAnimating(false);
                    // Trigger restart after animation completes
                    setTimeout(() => {
                      if (restartTimeoutRef.current) {
                        clearTimeout(restartTimeoutRef.current);
                      }
                      restartTimeoutRef.current = setTimeout(() => {
                        startTerminalAnimation();
                      }, 3000);
                    }, 100);
                  }, 2000);
                }, 500);
                return;
              }

              const currentStep = steps[index];
              // Add step with "processing" status first
              setTerminalSteps((prev) => [
                ...prev,
                { text: currentStep, status: "processing" },
              ]);

              // After a delay, mark it as "done" and move to next step
              setTimeout(() => {
                setTerminalSteps((prev) => {
                  const newSteps = [...prev];
                  if (newSteps[index]) {
                    newSteps[index] = { text: currentStep, status: "done" };
                  }
                  return newSteps;
                });
                // Move to next step after showing "done"
                setTimeout(() => {
                  processStep(index + 1);
                }, 300);
              }, 1000);
            };

            // Start processing steps
            processStep(0);
          }, 800);
        }, 1000);
      }
    }, 50);
  }, [steps]);

  useEffect(() => {
    // Auto-start animation on mount
    const timer = setTimeout(() => {
      startTerminalAnimation();
    }, 1000);
    return () => clearTimeout(timer);
  }, [startTerminalAnimation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, []);

  // Cursor blink animation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={heroRef} className="relative w-full flex md:items-center md:justify-center bg-white/96 dark:bg-black/[0.96] antialiased min-h-[40rem] md:min-h-[50rem] lg:min-h-[40rem] pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 overflow-hidden">
      {/* Spotlight SVG Animation */}
      <svg
        className="animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 3787 2842"
        fill="none"
      >
        <g filter="url(#filter)">
          <ellipse
            cx="1924.71"
            cy="273.501"
            rx="1924.71"
            ry="273.501"
            transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
            fill="white"
            fillOpacity="0.1"
          />
        </g>
        <defs>
          <filter
            id="filter"
            x="0.860352"
            y="0.838989"
            width="3785.16"
            height="2840.26"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="180" result="effect1_foregroundBlur_1065_8" />
          </filter>
        </defs>
      </svg>

      {/* Grid Background Pattern */}
      <div className="absolute inset-0 left-5 right-5 lg:left-16 lg:right-14 xl:left-16 xl:right-14  border-[0.5px] border-l-neutral-700 border-r-neutral-700">
        <div className="absolute inset-0 bg-grid text-muted/50 dark:text-white/[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="w-[76.75rem] max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-2rem)] mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Headline & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="space-y-3 sm:space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Patch your
                </h1>
                <ContainerTextFlip
                  words={["stack", "auth", "ui", "routes"]}
                  animationDuration={700}
                  interval={2000}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl dark:[background:linear-gradient(to_bottom,#0b0b0f,#0a0a0a)] [background:linear-gradient(to_bottom,#ffffff,#f3f4f6)] shadow-[inset_0_-1px_rgba(167,139,250,0.35),inset_0_0_0_1px_rgba(167,139,250,0.28),_0_10px_30px_rgba(167,139,250,0.15)] dark:shadow-[inset_0_-1px_rgba(167,139,250,0.22),inset_0_0_0_1px_rgba(167,139,250,0.18),_0_10px_30px_rgba(0,0,0,0.45)]"
                  textClassName="text-primary inline-block"
                />
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-primary">
                Not your sanity.
              </h2>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              StackPatch is a CLI that installs opinionated, battle-tested features
              like Auth, Redis, Payments — directly into your existing Next.js app.
            </p>
            {/* Code Block Strip */}
            <div className="relative flex items-center gap-2 w-full border border-white/10 dark:border-white/10">
              <div className="relative flex content-center transition duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-full">
                <div className="z-10 px-4 py-2 rounded-none w-full flex items-center justify-between gap-2 bg-zinc-100 dark:bg-zinc-950">
                  <div className="w-full flex flex-col min-[350px]:flex-row min-[350px]:items-center gap-0.5 min-[350px]:gap-2 min-w-0">
                    <p className="text-xs sm:text-sm font-mono select-none tracking-tighter space-x-1 shrink-0">
                      <span>
                        <span className="text-sky-500">git:</span>
                        <span className="text-red-400">(main)</span>
                      </span>
                      <span className="italic text-amber-600">x</span>
                    </p>
                    <p className="relative inline tracking-tight opacity-90 md:text-sm text-xs dark:text-white font-mono text-black">
                      npx  <span className="relative dark:text-fuchsia-300 text-fuchsia-800">
                        stackpatch@latest
                        <span className="absolute h-2 bg-gradient-to-tr from-white via-stone-200 to-stone-300 blur-3xl w-full top-0 left-2"></span>
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={copyCode}
                      className="hover:opacity-80 transition-opacity p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
                      aria-label="Copy npm install command"
                    >
                      {codeCopied ? (
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View stackpatch package on npm"
                      href="https://www.npmjs.com/package/stackpatch"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 128 128" aria-hidden="true">
                        <path fill="#cb3837" d="M0 7.062C0 3.225 3.225 0 7.062 0h113.88c3.838 0 7.063 3.225 7.063 7.062v113.88c0 3.838-3.225 7.063-7.063 7.063H7.062c-3.837 0-7.062-3.225-7.062-7.063zm23.69 97.518h40.395l.05-58.532h19.494l-.05 58.581h19.543l.05-78.075l-78.075-.1l-.1 78.126z"></path>
                        <path fill="#fff" d="M25.105 65.52V26.512H40.96c8.72 0 26.274.034 39.008.075l23.153.075v77.866H83.645v-58.54H64.057v58.54H25.105z"></path>
                      </svg>
                    </a>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View stackpatch repository on GitHub"
                      href="https://github.com/Darshh09/StackPatch"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256" aria-hidden="true">
                        <g fill="none">
                          <rect width="256" height="256" fill="#242938" rx="60"></rect>
                          <path fill="#fff" d="M128.001 30C72.779 30 28 74.77 28 130.001c0 44.183 28.653 81.667 68.387 94.89c4.997.926 6.832-2.169 6.832-4.81c0-2.385-.093-10.262-.136-18.618c-27.82 6.049-33.69-11.799-33.69-11.799c-4.55-11.559-11.104-14.632-11.104-14.632c-9.073-6.207.684-6.079.684-6.079c10.042.705 15.33 10.305 15.33 10.305c8.919 15.288 23.394 10.868 29.1 8.313c.898-6.464 3.489-10.875 6.349-13.372c-22.211-2.529-45.56-11.104-45.56-49.421c0-10.918 3.906-19.839 10.303-26.842c-1.039-2.519-4.462-12.69.968-26.464c0 0 8.398-2.687 27.508 10.25c7.977-2.215 16.531-3.326 25.03-3.364c8.498.038 17.06 1.149 25.051 3.365c19.087-12.939 27.473-10.25 27.473-10.25c5.443 13.773 2.019 23.945.98 26.463c6.412 7.003 10.292 15.924 10.292 26.842c0 38.409-23.394 46.866-45.662 49.341c3.587 3.104 6.783 9.189 6.783 18.519c0 13.38-.116 24.149-.116 27.443c0 2.661 1.8 5.779 6.869 4.797C199.383 211.64 228 174.169 228 130.001C228 74.771 183.227 30 128.001 30M65.454 172.453c-.22.497-1.002.646-1.714.305c-.726-.326-1.133-1.004-.898-1.502c.215-.512.999-.654 1.722-.311c.727.326 1.141 1.01.89 1.508m4.919 4.389c-.477.443-1.41.237-2.042-.462c-.654-.697-.777-1.629-.293-2.078c.491-.442 1.396-.235 2.051.462c.654.706.782 1.631.284 2.078m3.374 5.616c-.613.426-1.615.027-2.234-.863c-.613-.889-.613-1.955.013-2.383c.621-.427 1.608-.043 2.236.84c.611.904.611 1.971-.015 2.406m5.707 6.504c-.548.604-1.715.442-2.57-.383c-.874-.806-1.118-1.95-.568-2.555c.555-.606 1.729-.435 2.59.383c.868.804 1.133 1.957.548 2.555m7.376 2.195c-.242.784-1.366 1.14-2.499.807c-1.13-.343-1.871-1.26-1.642-2.052c.235-.788 1.364-1.159 2.505-.803c1.13.341 1.871 1.252 1.636 2.048m8.394.932c.028.824-.932 1.508-2.121 1.523c-1.196.027-2.163-.641-2.176-1.452c0-.833.939-1.51 2.134-1.53c1.19-.023 2.163.639 2.163 1.459m8.246-.316c.143.804-.683 1.631-1.864 1.851c-1.161.212-2.236-.285-2.383-1.083c-.144-.825.697-1.651 1.856-1.865c1.183-.205 2.241.279 2.391 1.097"></path>
                        </g>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="flex-none inset-0 overflow-hidden absolute z-0 rounded-none bg-gradient-to-tl dark:from-amber-100/30 dark:via-zinc-900 dark:to-black blur-md opacity-50"></div>
                <div className="bg-zinc-100 dark:bg-zinc-950 absolute z-[1] flex-none inset-[2px]"></div>
              </div>
            </div>

            {/* Get Started Button */}
            <div className="mt-4">
              <a
                href="/docs"
                className="group relative inline-block hover:shadow-lg dark:border-white dark:hover:shadow-lg border-2 border-black bg-white px-4 py-1.5 text-sm uppercase text-black shadow-[1px_1px_rgba(167,139,250,0.3),2px_2px_rgba(167,139,250,0.25),3px_3px_rgba(167,139,250,0.2),4px_4px_rgba(167,139,250,0.15),5px_5px_0px_0px_rgba(167,139,250,0.1)] transition duration-200 md:px-8 dark:shadow-[1px_1px_rgba(167,139,250,0.4),2px_2px_rgba(167,139,250,0.35),3px_3px_rgba(167,139,250,0.3),4px_4px_rgba(167,139,250,0.25),5px_5px_0px_0px_rgba(167,139,250,0.2)] dark:bg-zinc-950 dark:text-white dark:border-white"
              >
                <span className="relative z-10">Get Started</span>
                {/* Left spreading glow on hover */}
                <div
                  className="absolute -inset-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 0% 0%, rgba(167, 139, 250, 0.6) 0%, rgba(167, 139, 250, 0.3) 40%, transparent 70%)",
                    filter: "blur(12px)",
                  }}
                />
              </a>
            </div>
          </motion.div>

          {/* Right: Terminal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mt-8 md:mt-0"
          >
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 font-mono text-xs sm:text-sm shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-destructive"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 sm:ml-4 text-muted-foreground text-[10px] sm:text-xs">Terminal</span>
                <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Press 'b' to go back</span>
                </div>
              </div>
              <div className="space-y-2 min-h-[200px] sm:min-h-[250px]">
                {/* Command line */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-foreground break-all">
                    {typedText}
                    {isAnimating && showCursor && (
                      <span className="ml-1 text-primary">▋</span>
                    )}
                  </span>
                </div>

                {/* StackPatch Header with Logo */}
                {showAscii && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 my-3"
                  >
                    <Logo size={20} className="text-primary" />
                    <span className="text-primary font-semibold text-sm">StackPatch</span>
                  </motion.div>
                )}

                {/* Steps with applying/processing status */}
                {terminalSteps.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2 mt-3"
                  >
                    {terminalSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        {step.status === "processing" && (
                          <>
                            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary fill-primary shrink-0" />
                            <span className="text-muted-foreground text-xs sm:text-sm">
                              Applying <span className="text-primary font-medium">{step.text}</span>...
                            </span>
                          </>
                        )}
                        {step.status === "done" && (
                          <>
                            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 fill-green-500 flex-shrink-0" />
                            <span className="text-foreground text-xs sm:text-sm">
                              ✓ Applied <span className="text-primary font-medium">{step.text}</span>
                            </span>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Success message */}
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-2 sm:p-3 bg-green-500/10 border border-green-500/30 rounded flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 fill-green-500 shrink-0" />
                    <span className="text-green-500 font-semibold text-xs sm:text-sm">✓ Auth-UI patch applied successfully!</span>
                  </motion.div>
                )}

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
