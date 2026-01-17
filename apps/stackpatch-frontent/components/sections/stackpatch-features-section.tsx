"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { CheckCircle2, Folder, FolderOpen, File, Lock } from "lucide-react";

export function StackPatchFeaturesSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 border-b border-neutral-700">
      <div className="w-[76.75rem] max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-2rem)] mx-auto">
      <div className="mb-8 sm:mb-10 md:mb-12">
        <h2 className="text-xs sm:text-sm font-medium text-[#A78BFA] mb-3 sm:mb-4">StackPatch</h2>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold text-foreground mb-3 sm:mb-4">
          The easy solution to feature integration
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          StackPatch has all the features you need to add production-ready functionality to your existing app without restructuring or boilerplate bloat.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Auto-Detection Card - Large (spans 2 cols) */}
        <div className="col-span-1 sm:col-span-2 md:col-span-2 row-span-2">
          <AutoDetectionCard />
        </div>

        {/* Code Injection Card - Medium (spans 2 cols) */}
        <div className="col-span-1 sm:col-span-2 md:col-span-2">
          <CodeInjectionCard />
        </div>

        {/* File Tree Preview Card - Small (spans 2 cols) */}
        <div className="col-span-1 sm:col-span-2 md:col-span-2">
          <FileTreePreviewCard />
        </div>

        {/* Zero Configuration Card - Large (spans 2 cols) */}
        <div className="col-span-1 sm:col-span-2 md:col-span-2 h-full group isolate flex flex-col rounded-xl sm:rounded-2xl bg-card border border-border shadow-lg overflow-hidden">
          <div className="relative z-10 flex-none px-6 pt-6">
            <h3 className="text-sm font-medium text-foreground">Zero configuration</h3>
            <p className="mt-2 text-pretty text-sm/5 text-muted-foreground">
              Works out of the box. No config files, no setup required. Just add the patch and go.
            </p>
          </div>
          <div className="pointer-events-none relative flex-auto select-none" style={{ minHeight: "10.25rem" }}>
            <div className="flex h-full flex-col items-center justify-center p-6">
              <div className="w-full max-w-xs space-y-3">
                <div className="rounded-lg bg-muted bg-gradient-to-br from-white/5 to-65% border border-border p-4 font-mono text-xs ring-[0.25rem] ring-background/50">
                  <div className="text-muted-foreground mb-2">$ npx stackpatch add auth</div>
                  <div className="space-y-1" style={{ color: "#A78BFA" }}>
                    <div>✓ No config needed</div>
                    <div>✓ Auto-detected framework</div>
                    <div>✓ Ready to use</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-xs text-foreground">Patch applied successfully</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Own Your Code Card - Medium (spans 2 cols) */}
        <div className="col-span-1 sm:col-span-2 md:col-span-2 h-full group isolate flex flex-col rounded-xl sm:rounded-2xl bg-card border border-border shadow-lg overflow-hidden">
          <div className="relative z-10 flex-none px-6 order-last pb-6">
            <h3 className="text-sm font-medium text-foreground">You own the code</h3>
            <p className="mt-2 text-pretty text-sm/5 text-muted-foreground">
              All generated code lives in your repo. No magic, no black boxes, just clean, readable code.
            </p>
          </div>
          <div className="pointer-events-none relative flex-auto select-none" style={{ minHeight: "10.25rem" }}>
            <div className="flex h-full items-center justify-center p-4">
              <div className="w-full max-w-xs">
                <div className="rounded-lg bg-muted bg-gradient-to-br from-white/5 to-65% border border-border p-3 ring-[0.25rem] ring-background/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4" style={{ color: "#A78BFA" }} />
                    <span className="text-xs font-medium text-foreground">Your Code</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    <div>app/api/auth/route.ts</div>
                    <div className="mt-1" style={{ color: "#A78BFA" }}>✓ Fully editable</div>
                    <div style={{ color: "#A78BFA" }}>✓ No dependencies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

function AutoDetectionCard() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const detectionItems = useMemo(() => [
    { id: 1, text: "Found app/ directory", time: "14:09" },
    { id: 2, text: "Detected Next.js 16", time: "14:10" },
    { id: 3, text: "Found existing layout.tsx", time: "14:11" },
    { id: 4, text: "Scanning dependencies", time: "14:12" },
  ], []);

  const itemDelay = 600;
  const holdDuration = 2000; // Hold at the end before reset
  const totalDuration = detectionItems.length * itemDelay + holdDuration;

  const startAnimation = useCallback(() => {
    if (!inView) return;

    // Clear any existing timers
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    setIsAnimating(true);
    setVisibleItems([]);

    // Show items sequentially
    detectionItems.forEach((item, index) => {
      const timer = setTimeout(() => {
        setVisibleItems((prev) => [...prev, item.id]);
      }, index * itemDelay);
      timersRef.current.push(timer);
    });

    // Reset and restart after total duration
    animationRef.current = setTimeout(() => {
      setVisibleItems([]);
      // Brief pause before restart
      const restartTimer = setTimeout(() => {
        if (inView) {
          startAnimation();
        }
      }, 500);
      timersRef.current.push(restartTimer);
    }, totalDuration);
  }, [inView, detectionItems, itemDelay, totalDuration]);

  useEffect(() => {
    if (inView) {
      startAnimation();
    } else {
      setIsAnimating(false);
      setVisibleItems([]);
    }

    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [inView, startAnimation]);

  return (
    <div
      ref={ref}
      className="group isolate flex flex-col h-full rounded-2xl bg-card border border-border shadow-lg overflow-hidden"
    >
      <div className="relative z-10 flex-none px-6 pt-6">
        <h3 className="text-sm font-medium text-foreground">Auto-detection</h3>
        <p className="mt-3 text-pretty text-sm/5 text-muted-foreground">
          Instantly scans your project to identify frameworks, folder structures, and key configuration files enabling StackPatch to apply changes safely with zero manual setup, no matter how customized your codebase is.
        </p>
      </div>
      <div className="pointer-events-none relative flex-auto select-none" style={{marginTop : '-1rem' }}>
        <div className="flex h-full items-center justify-center p-4">
          <div className="w-min">
            {/* Notification Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex w-[calc(304/16*1rem)] items-center gap-3.5 rounded-md bg-muted bg-gradient-to-br from-white/5 to-65% p-3 ring-[0.25rem] ring-background/50"
            >
              <motion.div
                animate={inView ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <svg viewBox="0 0 16 16" fill="none" className="size-4">
                  <path
                    stroke="url(#paint0_radial_scan)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.25"
                    d="M8 1.75v1.042m0 10.416v1.042m3.125-11.663-.521.902m-5.208 9.022-.521.902m8.537-8.538-.902.52m-9.02 5.21-.903.52M14.25 8h-1.042M2.792 8H1.75m11.662 3.125-.902-.52m-9.02-5.21-.903-.52m8.538 8.538-.52-.902m-5.21-9.022-.52-.902"
                  />
                  <defs>
                    <radialGradient id="paint0_radial_scan" cx="0" cy="0" r="1" gradientTransform="rotate(102.529 4.047 5.711) scale(11.5244)" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#fff" />
                      <stop offset="1" stopColor="#fff" stopOpacity=".2" />
                    </radialGradient>
                  </defs>
                </svg>
              </motion.div>
              <div className="font-mono text-[0.625rem]/[1.125rem] text-muted-foreground transition duration-500 group-hover:text-foreground">
                Scanning project structure
              </div>
              <div className="ml-auto text-[0.625rem]/[1.125rem] text-muted-foreground">14:08</div>
            </motion.div>

            {/* Timeline */}
            <div className="relative pl-[2.875rem] pt-2 ">
              {/* Animated Connecting Line */}
              <div className="absolute left-[calc(19/16*1rem)] top-0 -z-10 aspect-[39/393] w-[calc(39/16*1rem)]">
                <svg viewBox="0 0 39 393" fill="none" className="absolute inset-0 size-full">
                  {/* Base line (static, faint) */}
                  <path
                    d="M2 0V34.6863C2 36.808 2.84285 38.8429 4.34315 40.3431L34.6569 70.6569C36.1571 72.1571 37 74.192 37 76.3137V393"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="stroke-border/20"
                  />
                  {/* Animated line - draws progressively as items appear */}
                  <motion.path
                    d="M2 0V34.6863C2 36.808 2.84285 38.8429 4.34315 40.3431L34.6569 70.6569C36.1571 72.1571 37 74.192 37 76.3137V393"
                    stroke="#A78BFA"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={
                      isAnimating
                        ? {
                            pathLength: visibleItems.length / detectionItems.length,
                          }
                        : { pathLength: 0 }
                    }
                    transition={{
                      duration: itemDelay / 1000,
                      ease: "easeOut",
                    }}
                    style={{
                      filter: "drop-shadow(0 0 2px rgba(167, 139, 250, 0.5))",
                    }}
                  />
                </svg>
              </div>

              {/* Timeline Items */}
              <div className="space-y-6 mt-15">
                {detectionItems.map((item) => {
                  const isVisible = visibleItems.includes(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={isVisible ? { opacity: 1 } : {}}
                      transition={{ duration: 0.4 }}
                      className="flex items-start gap-4 mt-9 text-[0.625rem]/[1.125rem]"
                    >
                      <div className="relative mt-[calc(1/16*1rem)] flex size-5 flex-none items-center justify-center rounded-full bg-muted/50">
                        <motion.div
                          className="size-1 rounded-full shadow-[0_1px_rgba(255,255,255,0.1)_inset,0_1px_2px_rgba(0,0,0,0.25)]"
                          style={{ backgroundColor: "#A78BFA" }}
                          initial={{ scale: 0 }}
                          animate={isVisible ? { scale: 1 } : {}}
                          transition={{ delay: 0.2, duration: 0.3 }}
                        />
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center rounded-full"
                          style={{ backgroundColor: "#A78BFA" }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                          transition={{ delay: 0.3, duration: 0.3 }}
                        >
                          <CheckCircle2 className="size-3 text-primary " strokeWidth={3.5} />
                        </motion.div>
                      </div>
                      <div>
                        <motion.div
                          className="font-medium text-foreground"
                          initial={{ opacity: 0, filter: "blur(8px)" }}
                          animate={isVisible ? { opacity: 1, filter: "blur(0px)" } : {}}
                          transition={{ delay: 0.1, duration: 0.4 }}
                        >
                          {item.text}
                        </motion.div>
                        <motion.div
                          className="text-muted-foreground"
                          initial={{ opacity: 0, transform: "translateY(0.5rem)" }}
                          animate={isVisible ? { opacity: 1, transform: "translateY(0)" } : {}}
                          transition={{ delay: 0.2, duration: 0.4 }}
                        >
                          Detected at {item.time}
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeInjectionCard() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [, setIsAnimating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const codeLines = useMemo(() => [
    { id: 1, text: 'import {"{ AuthWrapper "}', type: "existing" },
    { id: 2, text: 'from "@/components/auth-wrapper"', type: "added" },
    { id: 3, text: 'export default function RootLayout() {"{"}', type: "existing" },
    { id: 4, text: 'return (', type: "added" },
    { id: 5, text: '{"<"}AuthWrapper{">"}', type: "added" },
    { id: 6, text: '{"{children}"}', type: "existing" },
    { id: 7, text: '{"</"}AuthWrapper{">"}', type: "added" },
  ], []);

  const lineDelay = 500;
  const holdDuration = 2000;
  const totalDuration = codeLines.filter(l => l.type === "added").length * lineDelay + holdDuration;

  const startAnimation = useCallback(() => {
    if (!inView) return;

    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    setIsAnimating(true);
    setVisibleLines([]);

    // Show existing lines first
    const existingLines = codeLines.filter(l => l.type === "existing");
    existingLines.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line.id]);
      }, index * 200);
      timersRef.current.push(timer);
    });

    // Then show added lines with delay
    const addedLines = codeLines.filter(l => l.type === "added");
    addedLines.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line.id]);
      }, existingLines.length * 200 + index * lineDelay);
      timersRef.current.push(timer);
    });

    // Reset and restart
    animationRef.current = setTimeout(() => {
      setVisibleLines([]);
      const restartTimer = setTimeout(() => {
        if (inView) {
          startAnimation();
        }
      }, 500);
      timersRef.current.push(restartTimer);
    }, totalDuration);
  }, [inView, codeLines, lineDelay, totalDuration]);

  useEffect(() => {
    if (inView) {
      startAnimation();
    } else {
      setIsAnimating(false);
      setVisibleLines([]);
    }

    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [inView, startAnimation]);

  return (
    <div
      ref={ref}
      className="md:col-span-2 h-full group isolate flex flex-col rounded-2xl bg-card border border-border shadow-lg overflow-hidden"
    >
      <div className="relative z-10 flex-none px-6 order-last pb-6">
        <h3 className="text-sm font-medium text-foreground">Smart code injection</h3>
        <p className="mt-2 text-pretty text-sm/5 text-muted-foreground">
          Injects code only where needed, respecting your existing structure and conventions.
        </p>
      </div>
      <div className="pointer-events-none relative flex-auto select-none" style={{ minHeight: "10.25rem" }}>
        <div className="relative flex h-full flex-col items-center justify-center p-4">
          <div className="w-full max-w-xs">
            <div className="rounded-lg bg-muted bg-gradient-to-br from-white/5 to-65% border border-border p-3 font-mono text-xs overflow-hidden ring-[0.25rem] ring-background/50">
              <div className="text-muted-foreground mb-2">app/layout.tsx</div>
              <div className="space-y-1">
                {codeLines.map((line) => {
                  const isVisible = visibleLines.includes(line.id);
                  const isAdded = line.type === "added";

                  return (
                    <motion.div
                      key={line.id}
                      initial={{ opacity: 0, x: isAdded ? -10 : 0 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.3 }}
                      className={`relative ${isAdded ? "pl-4" : ""}`}
                    >
                      {isAdded && (
                        <motion.span
                          className="absolute left-0"
                          style={{ color: "#A78BFA" }}
                          initial={{ opacity: 0 }}
                          animate={isVisible ? { opacity: 1 } : {}}
                        >
                          +
                        </motion.span>
                      )}
                      <motion.div
                        className={isAdded ? "" : "text-foreground"}
                        style={isAdded ? { color: "#A78BFA" } : {}}
                        initial={isAdded ? { backgroundColor: "transparent" } : {}}
                        animate={
                          isAdded && isVisible
                            ? {
                                backgroundColor: ["transparent", "rgba(167, 139, 250, 0.15)", "rgba(167, 139, 250, 0.1)"],
                              }
                            : {}
                        }
                        transition={{ duration: 0.5 }}
                      >
                        {line.text}
                      </motion.div>
                      {isAdded && isVisible && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-0.5"
                          style={{ backgroundColor: "#A78BFA" }}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileTreePreviewCard() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const fileTreeItems = useMemo(() => [
    { id: 1, name: "app", type: "folder", isNew: false, indent: 0, y: 11, parentId: null },
    { id: 2, name: "api", type: "folder", isNew: false, indent: 1, y: 33, parentId: 1 },
    { id: 3, name: "auth", type: "folder", isNew: false, indent: 2, y: 55, parentId: 2 },
    { id: 4, name: "route.ts", type: "file", isNew: true, indent: 3, y: 77, parentId: 3 },
    { id: 5, name: "providers.ts", type: "file", isNew: true, indent: 2, y: 99, parentId: 2 },
  ], []);

  const itemDelay = 400;
  const holdDuration = 2000;
  const totalDuration = fileTreeItems.length * itemDelay + holdDuration;

  const startAnimation = useCallback(() => {
    if (!inView) return;

    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    setVisibleItems([]);

    fileTreeItems.forEach((item, index) => {
      const timer = setTimeout(() => {
        setVisibleItems((prev) => [...prev, item.id]);
      }, index * itemDelay);
      timersRef.current.push(timer);
    });

    animationRef.current = setTimeout(() => {
      setVisibleItems([]);
      const restartTimer = setTimeout(() => {
        if (inView) {
          startAnimation();
        }
      }, 500);
      timersRef.current.push(restartTimer);
    }, totalDuration);
  }, [inView, fileTreeItems, itemDelay, totalDuration]);

  useEffect(() => {
    if (inView) {
      startAnimation();
    } else {
      setVisibleItems([]);
    }

    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [inView, startAnimation]);

  // Calculate line paths for tree connections (SVG)
  const getLinePath = (item: typeof fileTreeItems[0], itemIndex: number) => {
    const parent = fileTreeItems.find(p => p.id === item.parentId);
    if (!parent) return null;

    const parentIndex = fileTreeItems.findIndex(p => p.id === parent.id);
    const indentSize = 20;
    const iconSize = 14;
    const iconCenter = iconSize / 2;
    const lineHeight = 18;
    const containerPadding = 12; // p-3 = 12px
    const gap = 2; // space-y-0.5 = 2px

    // Calculate actual Y positions based on index and lineHeight
    const parentY = containerPadding + (parentIndex * (lineHeight + gap)) + (lineHeight / 2) +7;
    const childY = containerPadding + (itemIndex * (lineHeight + gap)) + (lineHeight / 2);

    // X positions: account for padding, indent, and icon center
    const parentX = containerPadding + (parent.indent * indentSize) + iconCenter;
    const childX = containerPadding + (item.indent * indentSize);

    // L-shaped path: vertical line down from parent center, then horizontal to child
    return `M ${parentX} ${parentY} L ${parentX} ${childY} L ${childX} ${childY}`;
  };

  return (
    <div
      ref={ref}
      className="md:col-span-2 h-full group isolate flex flex-col rounded-2xl bg-card border border-border shadow-lg overflow-hidden"
    >
      <div className="relative z-10 flex-none px-6 order-last pb-6">
        <h3 className="text-sm font-medium text-foreground">File tree preview</h3>
        <p className="mt-2 text-pretty text-sm/5 text-muted-foreground">
          See exactly what files will be added before applying the patch.
        </p>
      </div>
      <div className="pointer-events-none relative flex-auto select-none" style={{ minHeight: "10.25rem" }}>
        <div className="flex h-full items-center justify-center p-4">
          <div className="w-full max-w-xs relative" style={{ height: "120px" }}>
            <div className="rounded-lg bg-muted bg-gradient-to-br from-white/5 to-65% border border-border ring-[0.25rem] ring-background/50 p-3 font-mono text-xs relative">
              {/* SVG overlay for connecting lines - positioned inside the container */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 300 120"
                preserveAspectRatio="none"
                style={{ zIndex: 1 }}
              >
                {/* Draw connecting lines */}
                {fileTreeItems.map((item, index) => {
                  const isVisible = visibleItems.includes(item.id);
                  const linePath = getLinePath(item, index);
                  if (!linePath) return null;

                  return (
                    <motion.path
                      key={`line-${item.id}`}
                      d={linePath}
                      stroke="#A78BFA"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ filter: "drop-shadow(0 0 2px rgba(167, 139, 250, 0.5))" }}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={isVisible ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  );
                })}
              </svg>
              <div className="space-y-0.5 relative" style={{ zIndex: 2 }}>
                {fileTreeItems.map((item, index) => {
                  const isVisible = visibleItems.includes(item.id);
                  const Icon = item.type === "folder"
                    ? (item.id === 1 || item.id === 2 || item.id === 3 ? FolderOpen : Folder)
                    : File;
                  const indentSize = 20;
                  const lineHeight = 22;

                  // Calculate if this item needs vertical guide lines
                  const _needsVerticalLine = item.indent > 0;
                  const _hasSiblingBelow = index < fileTreeItems.length - 1 &&
                    fileTreeItems[index + 1].indent > item.indent;

                  return (
                    <motion.div
                      key={item.id}
                      className="relative flex items-center gap-1.5 group/item"
                      style={{
                        paddingLeft: `${item.indent * indentSize}px`,
                        height: `${lineHeight}px`,
                      }}
                      initial={{ opacity: 0, x: -8 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {/* VS Code-style vertical guide lines */}
                      {item.indent > 0 && (
                        <div className="absolute left-0 top-0 bottom-0 flex pointer-events-none">
                          {Array.from({ length: item.indent }).map((_, i) => {
                            const level = i + 1;
                            // Check if there are items below at this or deeper indentation level
                            const remainingItems = fileTreeItems.slice(index + 1);
                            const hasContentBelow = remainingItems.some(
                              (nextItem) => nextItem.indent >= level
                            );

                            return (
                              <div
                                key={i}
                                className="relative"
                                style={{ width: `${indentSize}px` }}
                              >
                                {hasContentBelow && (
                                  <motion.div
                                    className="absolute left-[10px] top-0 bottom-0 w-[1px]"
                                    style={{ backgroundColor: "rgba(var(--foreground-rgb), 0.08)" }}
                                    initial={{ opacity: 0, scaleY: 0 }}
                                    animate={isVisible ? { opacity: 1, scaleY: 1 } : {}}
                                    transition={{ delay: index * 0.1 + 0.15, duration: 0.3 }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Icon */}
                      <div className="relative z-10 flex-shrink-0">
                        <Icon
                          className={`w-3.5 h-3.5 ${item.isNew ? "" : "text-muted-foreground"}`}
                          style={item.isNew ? { color: "#A78BFA" } : {}}
                        />
                      </div>

                      {/* File/Folder name */}
                      <span
                        className={`text-xs leading-none ${item.isNew ? "" : "text-foreground"}`}
                        style={item.isNew ? { color: "#A78BFA" } : {}}
                      >
                        {item.name}
                      </span>

                      {/* +new badge */}
                      {item.isNew && isVisible && (
                        <motion.span
                          className="text-[9px] px-1 py-0.5 rounded font-medium ml-1"
                          style={{
                            color: "#A78BFA",
                            backgroundColor: "rgba(167, 139, 250, 0.15)",
                            border: "1px solid rgba(167, 139, 250, 0.3)"
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                        >
                          new
                        </motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
