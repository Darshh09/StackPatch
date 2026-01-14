"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Github } from "lucide-react";
import { LogoText } from "@/components/logo";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import DocsSearchDialog from "@/components/docs-search-dialog";

interface NavbarProps {
  command?: string;
  onCopyCommand?: () => void;
}

export function Navbar(props: NavbarProps = {}) {
  const { onCopyCommand } = props;
  const { scrollYProgress } = useScroll();
  const navbarOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
  // Increase background opacity as user scrolls (from 0.85 to 0.98 for better visibility)
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.1], [0.85, 0.98]);
  const [bgColor, setBgColor] = useState("rgba(248, 248, 248, 0.85)");
  const [isDark, setIsDark] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // Update background color based on scroll and theme
  useMotionValueEvent(backgroundOpacity, "change", (latest) => {
    const opacity = latest as number;
    setBgColor(
      isDark
        ? `rgba(19, 19, 22, ${opacity})`
        : `rgba(248, 248, 248, ${opacity})`
    );
  });

  // Update when theme changes
  useEffect(() => {
    const currentOpacity = backgroundOpacity.get();
    setBgColor(
      isDark
        ? `rgba(19, 19, 22, ${currentOpacity})`
        : `rgba(248, 248, 248, ${currentOpacity})`
    );
  }, [isDark, backgroundOpacity]);

  return (
    <motion.nav
      style={{
        opacity: navbarOpacity,
      }}
      className="fixed top-4 left-0 right-0 z-50 px-4"
    >
      <div className="m-auto w-[76.75rem] max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-2rem)]">
        <motion.div
          style={{
            backgroundColor: bgColor,
          }}
          className="navbar-backdrop-blur relative z-30 mx-auto flex h-12 w-full items-center gap-6 rounded-2xl border border-border/50 px-4 py-1.5 shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_4px_12px_0_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.05)_inset] transition-all duration-500 ease-out dark:border-border/30 dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.2),0_4px_12px_0_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.03)_inset] md:px-6"
        >
          {/* Logo */}
          <a
            aria-label="StackPatch Home Page"
            href="/"
            className="group flex select-none items-center gap-3 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ WebkitTouchCallout: "none" }}
          >
            <LogoText />
            <div
              aria-hidden="true"
              className="hidden h-6 w-px bg-border/60 dark:bg-border/40 md:block"
            />
          </a>

          {/* Navigation */}
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {[
                { href: "/docs", label: "Docs" },
                { href: "#examples", label: "Examples" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group relative flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/80 transition-all duration-200 hover:text-foreground hover:bg-accent/50"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-200 group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side Actions */}
          <div className="ml-auto flex items-center gap-2">
            {/* Search (Fumadocs) */}
            <div className="hidden md:flex items-center">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex h-9 items-center gap-2 rounded-lg border border-border bg-background/60 px-3 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent/50 hover:text-foreground"
                aria-label="Search docs"
              >
                <span className="hidden md:inline">Search docs...</span>
                <kbd className="rounded border border-border/60 bg-background/80 px-1.5 py-0.5 text-[0.7rem] font-mono text-muted-foreground">
                  ⌘K
                </kbd>
              </button>
            </div>
            {/* Divider */}
            <div className="hidden h-6 w-px bg-border/60 dark:bg-border/40 sm:block" />

            {/* Theme Toggle */}
            <div className="hidden sm:flex items-center">
              <ThemeToggle />
            </div>

            {/* Social Icons */}
            <div className="hidden sm:flex items-center gap-1">
              {[
                {
                  href: "https://twitter.com/Darshhh1800",
                  label: "Twitter Profile",
                  icon: (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  href: "https://www.npmjs.com/package/stackpatch",
                  label: "npm Package",
                  icon: (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
                    </svg>
                  ),
                },
                {
                  href: "https://github.com/Darshh09/StackPatch",
                  label: "GitHub Repository",
                  icon: <Github className="h-4 w-4" />,
                },
              ].map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 hover:bg-accent/50 hover:text-foreground"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3 sm:gap-4 md:gap-4">
              <div className="hidden sm:contents">
                {onCopyCommand ? (
                  <button
                    onClick={onCopyCommand}
                    className="group relative isolate inline-flex items-center justify-center overflow-visible text-left font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] text-sm rounded-md bg-black  text-white h-[1.625rem] px-3 shadow-sm hover:shadow-lg "
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
                    <span className="relative z-10 text-white">Start building</span>
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
            className="ml-2 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground outline-none transition-all duration-200 hover:bg-accent/50 hover:text-foreground md:hidden"
            type="button"
            aria-label="Open navigation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className="h-4 w-4">
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M4 4.667L12 4.667" />
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M4 11.333L12 11.333" />
            </svg>
          </button>
        </motion.div>
      </div>
      <DocsSearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </motion.nav>
  );
}
