"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw, CheckCircle2, FileText, Trash2 } from "lucide-react";

export function RevertDemo() {
  const [step, setStep] = useState<"add" | "revert" | "complete">("add");
  const [showFiles, setShowFiles] = useState(false);
  const [showRevert, setShowRevert] = useState(false);
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);
  const [restoredFiles, setRestoredFiles] = useState<string[]>([]);
  const [animationKey, setAnimationKey] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const hasAnimatedRef = useRef(false); // Use ref to avoid closure issues

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            setHasAnimated(true);

            // Clear any existing timers
            timersRef.current.forEach(timer => clearTimeout(timer));
            timersRef.current = [];

            // Start animation sequence
            const timer1 = setTimeout(() => {
              setShowFiles(true);
            }, 1000);

            const timer2 = setTimeout(() => {
              setStep("revert");
              setShowRevert(true);
            }, 4000);

            const timer3 = setTimeout(() => {
              setRemovedFiles([
                "app/auth/login/page.tsx",
                "app/auth/signup/page.tsx",
                "components/auth-button.tsx",
                "components/protected-route.tsx",
              ]);
            }, 5000);

            const timer4 = setTimeout(() => {
              setRestoredFiles(["app/layout.tsx"]);
              setStep("complete");
            }, 7000);

            timersRef.current = [timer1, timer2, timer3, timer4];
          }
        });
      },
      {
        threshold: 0.1, // Start when 10% of the section is visible
        rootMargin: "50px", // Start slightly before it's fully in view
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []); // Empty dependency array - observer is set up once

  const resetDemo = () => {
    // Clear all timers
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];

    setStep("add");
    setShowFiles(false);
    setShowRevert(false);
    setRemovedFiles([]);
    setRestoredFiles([]);
    setHasAnimated(false);
    hasAnimatedRef.current = false; // Reset ref as well
    // Trigger animation restart
    setAnimationKey(prev => prev + 1);
  };

  return (
    <div ref={sectionRef} className="my-6 sm:my-8">
      <div className="bg-[#0A0A0A] border border-white/10 rounded-lg overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-[#161B22] border-b border-white/10 px-3 sm:px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1 sm:gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56]"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E]"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27C93F]"></div>
          </div>
          <span className="text-[10px] sm:text-xs text-[#9CA3AF] ml-1 sm:ml-2">Terminal</span>
          <button
            onClick={resetDemo}
            className="ml-auto text-[10px] sm:text-xs text-[#9CA3AF] hover:text-white transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Terminal Content */}
        <div className="p-3 sm:p-4 font-mono text-xs sm:text-sm">
          {/* Add Command */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[#06B6D4]">$</span>
              <span className="text-white break-all">npx stackpatch add auth</span>
            </div>
            <div className="text-[#9CA3AF] text-[10px] sm:text-xs ml-2 sm:ml-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="animate-pulse">⠋</span>
                <span>Detecting project structure...</span>
              </div>
              {showFiles && (
                <>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>✓ Copied app/auth/login/page.tsx</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>✓ Copied app/auth/signup/page.tsx</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>✓ Copied components/auth-button.tsx</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>✓ Copied components/protected-route.tsx</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400">
                    <FileText className="w-3 h-3" />
                    <span>✓ Updated app/layout.tsx</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#9CA3AF] mt-2">
                    <span>✓ Created .stackpatch/manifest.json</span>
                  </div>
                  <div className="text-green-400 mt-2">✅ Patch setup complete!</div>
                </>
              )}
            </div>
          </div>

          {/* Revert Command */}
          {showRevert && (
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[#06B6D4]">$</span>
                <span className="text-white break-all">npx stackpatch revert</span>
              </div>
              <div className="text-[#9CA3AF] text-[10px] sm:text-xs ml-2 sm:ml-4 space-y-1">
                <div className="text-yellow-400 mb-2">
                  🔄 Reverting StackPatch installation
                </div>
                <div className="text-[#9CA3AF] mb-2">
                  Patch: auth | Installed: {new Date().toLocaleString()}
                </div>
                <div className="text-white mb-2">Are you sure? (y/N): y</div>

                {removedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {removedFiles.map((file, idx) => (
                      <div
                        key={file}
                        className="flex items-center gap-2 text-red-400 animate-fade-in"
                        style={{ animationDelay: `${idx * 200}ms` }}
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>✓ Removed: {file}</span>
                      </div>
                    ))}
                  </div>
                )}

                {restoredFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {restoredFiles.map((file, idx) => (
                      <div
                        key={file}
                        className="flex items-center gap-2 text-green-400 animate-fade-in"
                        style={{ animationDelay: `${idx * 200}ms` }}
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>✓ Restored: {file}</span>
                      </div>
                    ))}
                  </div>
                )}

                {step === "complete" && (
                  <div className="text-green-400 mt-2">
                    ✅ Revert complete! Your project has been restored to its original state.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
