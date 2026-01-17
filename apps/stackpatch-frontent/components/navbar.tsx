"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Github, Search, Menu, ChevronDown } from "lucide-react";
import { LogoText } from "@/components/logo";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import DocsSearchDialog from "@/components/docs-search-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";
import { kFormatter } from "@/lib/utils";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDocsMenuOpen, setIsDocsMenuOpen] = useState(false);
  const [githubStars, setGithubStars] = useState<number | null>(null);

  // Fetch GitHub stars
  useEffect(() => {
    async function getGitHubStars() {
      try {
        const response = await fetch(
          "https://api.github.com/repos/Darshh09/StackPatch",
          {
            next: {
              revalidate: 60,
            },
          },
        );
        if (!response?.ok) {
          return null;
        }
        const json = await response.json();
        const stars = parseInt(json.stargazers_count);
        setGithubStars(stars);
      } catch {
        setGithubStars(null);
      }
    }
    getGitHubStars();
  }, []);

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

  const navigationItems = [
    { href: "/docs", label: "Docs" },
  ];

  const socialLinks = [
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
      icon: (
        <div className="relative">
          <Github className="h-4 w-4" />
          {githubStars !== null && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-500 px-1 text-[10px] font-semibold text-white shadow-sm">
              {kFormatter(githubStars)}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <motion.nav
      style={{
        opacity: navbarOpacity,
      }}
      className="fixed top-4 left-0 right-0 z-50 px-5 md:px-4 sm:px-6 lg:px-8"
    >
      <div className="m-auto w-[76.75rem] max-w-[calc(100vw-2.5rem)] md:max-w-[calc(100vw-2rem)]">
        <Collapsible open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <motion.div
            style={{
              backgroundColor: bgColor,
            }}
            className="navbar-backdrop-blur relative z-30 mx-auto flex h-14 w-full items-center gap-6 rounded-2xl border border-border/50 px-4 py-1.5 shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_4px_12px_0_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.05)_inset] transition-all duration-500 ease-out dark:border-border/30 dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.2),0_4px_12px_0_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.03)_inset] md:px-6"
          >
          {/* Logo */}
            <Link
            href="/"
              className="group flex select-none items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ WebkitTouchCallout: "none" }}
          >
            <LogoText />
            </Link>
            <div className="hidden sm:block h-6 border-l border-border" aria-hidden="true"></div>
            {/* Desktop Navigation */}
            <nav aria-label="Main" className="hidden sm:block">
              <ul className="flex items-center gap-2 ">
                {navigationItems.map((item) => (
                  <li key={item.href} className="list-none text-sm">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-primary"
                    >
                      {item.label}
                    </Link>
              </li>
                ))}
            </ul>
          </nav>

            {/* Right Side Actions - Desktop */}
            <div className="ml-auto flex items-center justify-end gap-1.5 flex-1 max-lg:hidden">
              {/* Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex items-center gap-2 border bg-background/50 p-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground w-full rounded-full ps-2.5 max-w-[240px]"
                aria-label="Search docs"
              >
                <Search className="h-4 w-4" />
                <span className="flex-1 text-left">Search</span>
                <div className="ms-auto inline-flex gap-0.5">
                  <kbd className="rounded-md border bg-background px-1.5 text-xs">⌘</kbd>
                  <kbd className="rounded-md border bg-background px-1.5 text-xs">K</kbd>
                </div>
              </button>


              <div className="hidden sm:block h-6 border-l border-border" aria-hidden="true"></div>
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Social Icons */}
              <ul className="flex flex-row gap-2 items-center">
                {socialLinks.map((social) => (
                  <li key={social.href} className="list-none -mx-1 first:ms-0 last:me-0">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 hover:bg-accent hover:text-accent-foreground p-1.5 [&_svg]:size-5"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Start Building Button */}
              <div className="hidden sm:contents">
                {onCopyCommand ? (
                  <button
                    onClick={onCopyCommand}
                    className="group relative isolate inline-flex items-center justify-center overflow-visible text-left font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] text-sm rounded-md bg-black text-white h-[1.625rem] px-3 shadow-sm hover:shadow-lg"
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

            {/* Mobile Actions */}
            <div className="flex items-center ms-auto -me-1.5 lg:hidden">
              {/* Search Icon */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 hover:bg-accent hover:text-accent-foreground [&_svg]:size-4.5 p-2"
                aria-label="Open Search"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Menu Toggle */}
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 hover:bg-accent hover:text-accent-foreground p-1.5 group [&_svg]:size-5.5"
                  aria-label="Toggle Menu"
                >
                  <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </button>
              </CollapsibleTrigger>
            </div>
          </motion.div>

          {/* Mobile Menu Content (mobile only) */}
          <CollapsibleContent className="relative z-20 px-4 lg:hidden">
            <div className="mt-2 mb-3 rounded-2xl border border-border bg-background/90 backdrop-blur-sm shadow-lg px-3 py-3 space-y-1">
              {/* Mobile Navigation Links */}
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 py-1.5 transition-colors hover:text-foreground/50 data-[active=true]:font-medium data-[active=true]:text-primary [&_svg]:size-4 first:mt-4 sm:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Social Icons & Theme Toggle */}
              <div className="-ms-1.5 flex flex-row pt-2 pb-4 items-center justify-end gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 hover:bg-accent hover:text-accent-foreground p-1.5 [&_svg]:size-5 -mx-1 first:ms-0"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
                <div role="separator" className="flex-1 sm:hidden" />
                <ThemeToggle />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <DocsSearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </motion.nav>
  );
}
