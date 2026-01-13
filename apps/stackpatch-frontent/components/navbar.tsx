"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Github } from "lucide-react";
import { LogoText } from "@/components/logo";

interface NavbarProps {
  command?: string;
  onCopyCommand?: () => void;
}

export function Navbar(props: NavbarProps = {}) {
  const { onCopyCommand } = props;
  const { scrollYProgress } = useScroll();
  const navbarOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  return (
    <motion.nav
      style={{
        opacity: navbarOpacity,
      }}
      className="fixed top-4 left-0 right-0 z-50 px-4"
    >
      <div className="transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow,background] duration-[450ms] ease-[cubic-bezier(0.33,1,0.68,1)] hover:duration-200 m-auto w-[76.75rem] max-w-[calc(100vw-1rem)] rounded-xl md:max-w-[calc(100vw-2rem)]">
        <div className="transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow,background] duration-[450ms] ease-[cubic-bezier(0.33,1,0.68,1)] hover:duration-200 pointer-events-auto relative z-30 mx-auto flex h-fit w-full items-center rounded-xl bg-[rgba(248,248,248,0.9)] px-2 py-0 pl-3 pr-0 [box-shadow:0_0_0_0.5px_rgba(255,255,255,0.9)_inset,0_0_0_0.5px_rgba(19,19,22,0.15),0_2px_3px_0_rgba(0,0,0,0.04),0_4px_6px_0_rgba(34,42,53,0.04),0_1px_1px_0_rgba(0,0,0,0.05)] dark:bg-[rgba(19,19,22,0.90)] dark:[box-shadow:0_0_0_0.5px_rgba(247,247,248,0.15)_inset,0_0_0_0.5px_rgba(19,19,22,0.8),0_2px_3px_0_rgba(0,0,0,0.16),0_4px_6px_0_rgba(34,42,53,0.16),0_1px_1px_0_rgba(0,0,0,0.16)] md:py-2 md:pr-2 [@media(width<22.5rem)]:h-[2.626rem]">
          {/* Logo */}
          <a
            aria-label="StackPatch Home Page"
            className="flex select-none items-center gap-x-3"
            href="/"
            style={{ WebkitTouchCallout: "none" }}
          >
            <LogoText />
            <div
              aria-hidden="true"
              className="transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow,background] duration-[450ms] ease-[cubic-bezier(0.33,1,0.68,1)] hover:duration-200 box-content hidden h-[1.625rem] w-[0.5px] border-r-[0.5px] border-solid border-[rgba(255,255,255,1)] bg-[rgba(19,19,22,0.15)] dark:border-[rgba(255,255,255,0)] dark:bg-[rgba(247,247,248,0.15)] md:block"
            />
          </a>

          {/* Navigation */}
          <nav aria-label="Main" className="ml-3 hidden md:block">
            <ul className="group/nav flex items-center text-foreground">
              <li className="group/item flex">
                <a href="#patches" className="group/link flex px-2 py-1">
                  <span className="text-sm font-medium text-foreground transition-colors duration-200 group-has-[.group/item:hover]/nav:text-muted-foreground group-hover/item:text-muted-foreground">
                    Patches
                  </span>
                </a>
              </li>
              <li className="group/item flex">
                <a href="/docs" className="group/link flex px-2 py-1">
                  <span className="text-sm font-medium text-foreground transition-colors duration-200 group-has-[.group/item:hover]/nav:text-muted-foreground group-hover/item:text-muted-foreground">
                    Docs
                  </span>
                </a>
              </li>
              <li className="group/item flex">
                <a href="#examples" className="group/link flex px-2 py-1">
                  <span className="text-sm font-medium text-foreground transition-colors duration-200 group-has-[.group/item:hover]/nav:text-muted-foreground group-hover/item:text-muted-foreground">
                    Examples
                  </span>
                </a>
              </li>
              <li className="group/item flex">
                <a
                  href="https://github.com/Darshh09/StackPatch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex px-2 py-1"
                >
                  <span className="text-sm font-medium text-foreground transition-colors duration-200 group-has-[.group/item:hover]/nav:text-muted-foreground group-hover/item:text-muted-foreground flex items-center gap-1">
                    <Github className="w-4 h-4" />
                    GitHub
                  </span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Right Side Actions */}
          <div className="ml-auto flex items-center gap-6 font-medium [@media(width<22.5rem)]:hidden">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-4">

              <div className="hidden sm:contents">
                {onCopyCommand ? (
                  <button
                    onClick={onCopyCommand}
                    className="group relative isolate inline-flex items-center justify-center overflow-visible text-left font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] text-sm rounded-md bg-background border border-border text-foreground h-[1.625rem] px-2.5 hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm hover:shadow-lg"
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
                    <span className="relative z-10">Start building</span>
                    <svg
                      viewBox="0 0 10 10"
                      aria-hidden="true"
                      className="ml-2 h-2.5 w-2.5 flex-none opacity-60 group-hover:translate-x-6 group-hover:opacity-0 transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)]"
                    >
                      <path
                        fill="currentColor"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="m7.25 5-3.5-2.25v4.5L7.25 5Z"
                      />
                    </svg>
                    <svg
                      viewBox="0 0 10 10"
                      aria-hidden="true"
                      className="-ml-2.5 h-2.5 w-2.5 flex-none -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)]"
                    >
                      <path
                        fill="currentColor"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="m7.25 5-3.5-2.25v4.5L7.25 5Z"
                      />
                    </svg>
                  </button>
                ) : (
                  <a
                    href="/"
                    className="group relative isolate inline-flex items-center justify-center overflow-visible text-left font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] text-sm rounded-md bg-background border border-border text-foreground h-[1.625rem] px-2.5 hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm hover:shadow-lg"
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
                    <span className="relative z-10">Get started</span>
                    <svg
                      viewBox="0 0 10 10"
                      aria-hidden="true"
                      className="ml-2 h-2.5 w-2.5 flex-none opacity-60 group-hover:translate-x-6 group-hover:opacity-0 transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)]"
                    >
                      <path
                        fill="currentColor"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="m7.25 5-3.5-2.25v4.5L7.25 5Z"
                      />
                    </svg>
                    <svg
                      viewBox="0 0 10 10"
                      aria-hidden="true"
                      className="-ml-2.5 h-2.5 w-2.5 flex-none -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)]"
                    >
                      <path
                        fill="currentColor"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="m7.25 5-3.5-2.25v4.5L7.25 5Z"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="relative ml-0 flex size-[2.625rem] items-center justify-center text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground md:hidden [@media(width<22.5rem)]:ml-auto"
            type="button"
            aria-label="Open navigation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className="size-4">
              <path stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" d="M4 4.667L12 4.667" />
              <path stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" d="M4 11.333L12 11.333" />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
