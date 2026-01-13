"use client";

import { Github } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="w-[76.75rem] max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-2rem)] mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 grid gap-8 sm:mb-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* StackPatch Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <Logo size={28} />
              <h3 className="font-semibold text-base text-foreground font-heading">
                StackPatch
              </h3>
            </div>
            <p className="mb-4 text-muted-foreground text-sm leading-relaxed sm:mb-6 sm:text-base lg:pr-4">
              Add production-ready features to your existing Next.js projects without restructuring. Own your code, ship faster.
            </p>
            <div className="flex space-x-4">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/Darshh09/StackPatch"
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                aria-label="GitHub Repository"
              >
                <Github className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.npmjs.com"
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                aria-label="NPM Package"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M1.763 0C.786 0 .002.785.002 1.763v20.474c0 .978.784 1.763 1.763 1.763h20.474c.978 0 1.763-.785 1.763-1.763V1.763C24.002.785 23.217 0 22.237 0H1.763zm9.436 2.192h2.602v2.602h2.602v2.602h-2.602v2.602h-2.602V7.396H6.597V4.794h4.602V2.192zm-7.396 9.406h2.602v2.602h2.602v2.602H6.597v2.602H3.995v-2.602H1.393v-2.602h2.602v-2.602z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 font-semibold text-base text-foreground sm:mb-4 font-heading">Resources</h3>
            <ul className="space-y-2 text-muted-foreground text-sm sm:space-y-3 sm:text-base">
              <li>
                <Link
                  href="https://github.com/Darshh09/StackPatch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-colors hover:text-primary focus:text-primary focus:outline-none"
                >
                  GitHub Repository
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.npmjs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-colors hover:text-primary focus:text-primary focus:outline-none"
                >
                  NPM Package
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="inline-block transition-colors hover:text-primary focus:text-primary focus:outline-none"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 font-semibold text-base text-foreground sm:mb-4 font-heading">Contact</h3>
            <div className="space-y-3 text-muted-foreground text-sm sm:space-y-4 sm:text-base">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="inline-flex w-fit rounded bg-muted px-2 py-1 font-mono text-xs sm:text-sm border border-border">
                  $
                </span>
                <a
                  href="mailto:your-email@example.com"
                  className="break-all sm:break-normal transition-colors hover:text-primary"
                >
                  your-email@example.com
                </a>
              </div>
              <p className="text-sm leading-relaxed sm:text-base">
                Have questions or feedback? Feel free to reach out or open an issue on GitHub.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:gap-6 sm:pt-8">
          <p className="text-center text-muted-foreground text-xs sm:text-left sm:text-sm">
            © {new Date().getFullYear()} StackPatch. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-muted-foreground text-xs sm:text-sm">
            Built with
            <span className="font-medium text-primary">
              Next.js and TypeScript
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
