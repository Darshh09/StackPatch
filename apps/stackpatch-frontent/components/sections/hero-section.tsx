"use client";

import { motion } from "motion/react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";

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
  const heroRef = useRef<HTMLDivElement>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const steps = useMemo(() => [
    "NextAuth.js",
    "Auth providers",
    "Routes & UI",
    "Toaster component",
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
    <section ref={heroRef} className="pt-32 pb-20 px-4">
      <div className="w-[76.75rem] max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-2rem)] mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Headline & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="font-heading text-6xl  font-bold tracking-tight">
              Patch your stack.
              <br />
              <span className="text-primary">Not your sanity.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              StackPatch is a CLI that installs opinionated, battle-tested features
              like Auth, Redis, Payments — directly into your existing Next.js app.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                onClick={onCopy}
                className="group relative isolate inline-flex items-center justify-center overflow-visible text-left font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] text-sm rounded-md bg-white text-primary-foreground px-6 py-3 hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Enhanced shadow glow from left corner */}
                <div
                  className="absolute -inset-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 0% 0%, rgba(167, 139, 250, 0.6) 0%, rgba(167, 139, 250, 0.3) 40%, transparent 70%)",
                    filter: "blur(12px)",
                  }}
                />
                {/* Additional shine layer */}
                <div
                  className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)",
                    filter: "blur(4px)",
                  }}
                />
                <code className="font-mono text-sm relative z-10">{command}</code>
                <motion.div
                  className="relative z-10 ml-2"
                  animate={copied ? { scale: [1, 1.2, 1] } : {}}
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4 opacity-60" />
                  )}
                </motion.div>
              </motion.button>
              <motion.button
                className="relative flex items-center gap-2 px-6 py-3 border border-border text-foreground font-semibold rounded-lg overflow-hidden group transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-muted"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0.36, 0, 1] }}
                />
                <span className="relative z-10 transition-colors duration-300">View patches</span>
                <motion.div
                  className="relative z-10 transition-colors duration-300"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.button>
            </div>
          </motion.div>

          {/* Right: Terminal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-card border border-border rounded-xl p-6 font-mono text-sm shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-muted-foreground text-xs">Terminal</span>
                <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Press 'b' to go back</span>
                </div>
              </div>
              <div className="space-y-2 min-h-[250px]">
                {/* Command line */}
                <div className="flex items-center gap-2">

                  <span className="text-foreground">
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
                            <CheckCircle2 className="w-4 h-4 text-primary fill-primary shrink-0" />
                            <span className="text-muted-foreground">
                              Applying <span className="text-primary font-medium">{step.text}</span>...
                            </span>
                          </>
                        )}
                        {step.status === "done" && (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-500 fill-green-500 flex-shrink-0" />
                            <span className="text-foreground">
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
                    className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-500" />
                    <span className="text-green-500 font-semibold">✓ Auth-UI patch applied successfully!</span>
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
