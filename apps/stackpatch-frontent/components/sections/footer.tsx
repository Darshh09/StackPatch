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
            <div className="flex flex-col gap-4">
              <div className="flex space-x-4">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://twitter.com/Darshhh1800"
                  className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  aria-label="Twitter Profile"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.npmjs.com/package/stackpatch"
                  className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  aria-label="npm Package"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
                  </svg>
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/Darshh09/StackPatch"
                  className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  aria-label="GitHub Repository"
                >
                  <Github className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
              {/* Product Hunt Badge */}
              <a
                href="https://www.producthunt.com/products/stackpatch?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-stackpatch"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-opacity hover:opacity-80"
                aria-label="StackPatch on Product Hunt"
              >
                <img
                  alt="StackPatch - Patch authentication into your Next.js app with one command | Product Hunt"
                  width="250"
                  height="54"
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1063012&theme=light&t=1768419170786"
                  className="h-auto w-[180px] sm:w-[200px] dark:hidden"
                />
                <img
                  alt="StackPatch - Patch authentication into your Next.js app with one command | Product Hunt"
                  width="250"
                  height="54"
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1063012&theme=dark&t=1768419170786"
                  className="hidden h-auto w-[180px] sm:w-[200px] dark:block"
                />
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
                  href="https://www.npmjs.com/package/stackpatch"
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
                  darshitshukla1777@gmail.com
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
