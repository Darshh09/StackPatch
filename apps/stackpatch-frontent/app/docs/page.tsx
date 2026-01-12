"use client";

import { useState, useEffect, useRef } from "react";
import { TextAlignStart } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/sections/footer";

interface TOCItem {
  id: string;
  title: string;
  level: number;
  active?: boolean;
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("philosophy");
  const [tocItems] = useState<TOCItem[]>([
    { id: "philosophy", title: "Philosophy", level: 0 },
    { id: "get-started", title: "Get Started", level: 0 },
    { id: "prerequisites", title: "Prerequisites", level: 1 },
    { id: "add-patch", title: "Adding Patches", level: 1 },
    { id: "create-project", title: "Creating Projects", level: 1 },
    { id: "available-patches", title: "Available Patches", level: 0 },
    { id: "auth-patch", title: "Auth Patch", level: 1 },
    { id: "how-it-works", title: "How It Works", level: 0 },
    { id: "next-steps", title: "Next Steps", level: 0 },
  ]);

  const sectionsRef = useRef<{ [key: string]: HTMLElement }>({});

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -80% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        sectionsRef.current[item.id] = element;
        observer.observe(element);
      }
    });

    return () => {
      Object.values(sectionsRef.current).forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, [tocItems]);

  const handleTOCClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Calculate active item position for indicator
  const activeIndex = tocItems.findIndex((item) => item.id === activeSection);
  const activeItemTop = activeIndex * 36; // Approximate height per item
  const activeItemHeight = 36;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-24 w-[76.75rem] max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-2rem)] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_268px] gap-12">
          {/* Main Content */}
          <article className="prose prose-invert max-w-none">
            <section id="philosophy" className="scroll-mt-24 mb-16">
              <h1 className="text-4xl font-bold mb-6 font-heading">Philosophy</h1>
              <p className="text-lg text-[#9CA3AF] leading-relaxed mb-4">
                StackPatch is built on the principle that developers should own their code. Unlike traditional
                boilerplates or SaaS solutions, StackPatch gives you complete control over every line of code
                in your application.
              </p>
              <p className="text-lg text-[#9CA3AF] leading-relaxed mb-4">
                We believe in:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#9CA3AF] mb-6">
                <li>Zero vendor lock-in - Your code, your rules</li>
                <li>Production-ready defaults - Battle-tested patterns out of the box</li>
                <li>Incremental adoption - Add features to existing projects seamlessly</li>
                <li>Framework agnostic - Works with your favorite stack</li>
              </ul>
            </section>

            <section id="get-started" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold mb-6 font-heading">Get Started</h2>
              <p className="text-lg text-[#9CA3AF] leading-relaxed mb-6">
                Getting started with StackPatch is simple. You can either add patches to an existing project or create a new one from scratch.
              </p>

              <section id="prerequisites" className="scroll-mt-24 mb-12">
                <h3 className="text-2xl font-semibold mb-4 font-heading">Prerequisites</h3>
                <p className="text-[#9CA3AF] mb-4">
                  Before you begin, make sure you have:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#9CA3AF] mb-6">
                  <li>Node.js 18+ or Bun installed</li>
                  <li>A Next.js project with App Router (or create a new one)</li>
                  <li>Basic familiarity with React and TypeScript</li>
                  <li>pnpm, npm, yarn, or bun as your package manager</li>
                </ul>
              </section>

              <section id="add-patch" className="scroll-mt-24 mb-12">
                <h3 className="text-2xl font-semibold mb-4 font-heading">Adding Patches to Existing Projects</h3>
                <p className="text-[#9CA3AF] mb-4">
                  To add a patch to your existing Next.js project, navigate to your project directory and run:
                </p>
                <div className="bg-[#161B22] border border-white/10 rounded-lg p-4 mb-4 font-mono text-sm">
                  <code className="text-[#06B6D4]">$</code> <code className="text-white">npx stackpatch add auth</code>
                </div>
                <p className="text-[#9CA3AF] mb-4">
                  StackPatch will:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#9CA3AF] mb-6">
                  <li>Auto-detect your Next.js project structure</li>
                  <li>Copy authentication files to your project</li>
                  <li>Install missing dependencies (next-auth, react-hot-toast)</li>
                  <li>Update your layout.tsx to include AuthSessionProvider and Toaster</li>
                  <li>Create login and signup pages at <code className="bg-[#0A0A0A] px-1 rounded">/auth/login</code> and <code className="bg-[#0A0A0A] px-1 rounded">/auth/signup</code></li>
                </ul>
                <p className="text-[#9CA3AF] mb-4">
                  You can also use <code className="bg-[#0A0A0A] px-1 rounded">npx stackpatch add auth-ui</code> - both commands do the same thing.
                </p>
              </section>

              <section id="create-project" className="scroll-mt-24 mb-12">
                <h3 className="text-2xl font-semibold mb-4 font-heading">Creating a New Project</h3>
                <p className="text-[#9CA3AF] mb-4">
                  To create a new StackPatch project from scratch:
                </p>
                <div className="bg-[#161B22] border border-white/10 rounded-lg p-4 mb-4 font-mono text-sm">
                  <code className="text-[#06B6D4]">$</code> <code className="text-white">npx stackpatch create my-app</code>
                </div>
                <p className="text-[#9CA3AF] mb-4">
                  Or using Bun:
                </p>
                <div className="bg-[#161B22] border border-white/10 rounded-lg p-4 mb-4 font-mono text-sm">
                  <code className="text-[#06B6D4]">$</code> <code className="text-white">bun create stackpatch@latest my-app</code>
                </div>
                <p className="text-[#9CA3AF] mb-4">
                  This will:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#9CA3AF] mb-6">
                  <li>Create a new Next.js project with TypeScript and Tailwind CSS</li>
                  <li>Set up the basic project structure</li>
                  <li>Install all dependencies</li>
                  <li>Show you a beautiful welcome screen</li>
                </ul>
                <p className="text-[#9CA3AF] mb-4">
                  After creation, you can add patches to your new project using the <code className="bg-[#0A0A0A] px-1 rounded">npx stackpatch add</code> command.
                </p>
              </section>
            </section>

            <section id="available-patches" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold mb-6 font-heading">Available Patches</h2>
              <p className="text-lg text-[#9CA3AF] leading-relaxed mb-6">
                StackPatch currently offers the following patches:
              </p>

              <section id="auth-patch" className="scroll-mt-24 mb-12">
                <h3 className="text-2xl font-semibold mb-4 font-heading">Auth Patch</h3>
                <p className="text-[#9CA3AF] mb-4">
                  The Auth patch adds complete authentication functionality to your Next.js app using NextAuth.js.
                </p>
                <p className="text-[#9CA3AF] mb-4 font-semibold">
                  What it includes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#9CA3AF] mb-6">
                  <li>NextAuth.js API route at <code className="bg-[#0A0A0A] px-1 rounded">app/api/auth/[...nextauth]/route.ts</code></li>
                  <li>Authentication providers configuration</li>
                  <li>Login page at <code className="bg-[#0A0A0A] px-1 rounded">app/auth/login/page.tsx</code></li>
                  <li>Signup page at <code className="bg-[#0A0A0A] px-1 rounded">app/auth/signup/page.tsx</code></li>
                  <li>Session provider component</li>
                  <li>Toaster component for notifications</li>
                  <li>Auth button component for easy sign in/out</li>
                </ul>
                <p className="text-[#9CA3AF] mb-4">
                  <strong>Dependencies installed:</strong> next-auth, react-hot-toast
                </p>
                <p className="text-[#9CA3AF] mb-4">
                  <strong>Usage:</strong>
                </p>
                <div className="bg-[#161B22] border border-white/10 rounded-lg p-4 mb-4 font-mono text-sm">
                  <code className="text-[#06B6D4]">$</code> <code className="text-white">npx stackpatch add auth</code>
                </div>
              </section>
            </section>

            <section id="how-it-works" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold mb-6 font-heading">How It Works</h2>
              <p className="text-lg text-[#9CA3AF] leading-relaxed mb-6">
                StackPatch follows a simple, transparent process:
              </p>
              <ol className="list-decimal list-inside space-y-4 text-[#9CA3AF] mb-6">
                <li>
                  <strong className="text-white">Detection:</strong> StackPatch automatically detects your Next.js project structure, including whether you're using the App Router or Pages Router.
                </li>
                <li>
                  <strong className="text-white">File Copying:</strong> Relevant files from the patch are copied to your project. If files already exist, you'll be prompted to overwrite them.
                </li>
                <li>
                  <strong className="text-white">Dependency Installation:</strong> Missing dependencies are automatically installed using your project's package manager (detected automatically).
                </li>
                <li>
                  <strong className="text-white">Code Injection:</strong> For patches like Auth, StackPatch intelligently updates your <code className="bg-[#0A0A0A] px-1 rounded">layout.tsx</code> to include necessary providers.
                </li>
                <li>
                  <strong className="text-white">You Own It:</strong> All code is copied directly into your repository. No magic, no black boxes - just clean, readable code that you can modify however you want.
                </li>
              </ol>
            </section>

            <section id="next-steps" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold mb-6 font-heading">Next Steps</h2>
              <p className="text-lg text-[#9CA3AF] leading-relaxed mb-4">
                Now that you're set up, here's what to do next:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-[#9CA3AF] mb-6">
                <li>Configure your authentication providers in <code className="bg-[#0A0A0A] px-1 rounded">app/api/auth/[...nextauth]/route.ts</code></li>
                <li>Set up environment variables (NEXTAUTH_SECRET, NEXTAUTH_URL, etc.)</li>
                <li>Customize the login and signup pages to match your design</li>
                <li>Explore the generated code and understand how it works</li>
                <li>If you encounter any issues or have questions, please raise an issue on GitHub or contact us</li>
              </ol>
              <p className="text-lg text-[#9CA3AF] leading-relaxed">
                We're here to help! If you find any bugs, have feature requests, or need assistance, don't hesitate to open an issue on our GitHub repository or reach out to us.
              </p>
            </section>
          </article>

          {/* Table of Contents */}
          <aside
            id="nd-toc"
            className="sticky top-24 h-[calc(100vh-6rem)] flex flex-col w-[268px] pt-12 pe-4 pb-2 max-xl:hidden"
          >
            <h3
              id="toc-title"
              className="inline-flex items-center gap-1.5 text-sm text-[#9CA3AF] mb-4"
            >
              <TextAlignStart className="size-4" aria-hidden="true" />
              On this page
            </h3>
            <div className="relative min-h-0 text-sm ms-px overflow-auto [scrollbar-width:none] mask-[linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] py-3">
              {/* Active Indicator */}
              <div
                className="absolute start-0 top-0 rtl:-scale-x-100 transition-[top,height] duration-200"
                style={{
                  width: "12px",
                  height: `${activeItemHeight}px`,
                  top: `${activeItemTop + 12}px`,
                  maskImage: `url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%20384%22%3E%3Cpath%20d%3D%22M1%2012%20L1%2032%20L1%2044%20L1%2064%20L11%2076%20L11%2096%20L11%20108%20L11%20128%20L11%20140%20L11%20160%20L1%20172%20L1%20192%20L11%20204%20L11%20224%20L11%20236%20L11%20256%20L11%20268%20L11%20288%20L11%20300%20L11%20320%20L1%20332%20L1%20352%20L1%20364%20L1%20384%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20%2F%3E%3C%2Fsvg%3E")`,
                }}
              >
                <div
                  className="absolute w-full bg-[#A78BFA] transition-[top,height] duration-200"
                  style={{
                    top: "0px",
                    height: `${activeItemHeight}px`,
                  }}
                />
              </div>

              <div className="flex flex-col">
                {tocItems.map((item, index) => {
                  const isActive = item.id === activeSection;
                  const isFirst = index === 0;
                  const isLast = index === tocItems.length - 1;
                  const nextItem = tocItems[index + 1];
                  const prevItem = tocItems[index - 1];
                  const isNested = item.level > 0;
                  const hasNestedAfter = nextItem?.level > item.level;
                  const hasNestedBefore = prevItem?.level > item.level;

                  return (
                    <a
                      key={item.id}
                      data-active={isActive}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTOCClick(item.id);
                      }}
                      className={`prose relative py-1.5 text-sm transition-colors wrap-anywhere ${
                        isFirst ? "pt-0" : ""
                      } ${isLast ? "pb-0" : ""} ${
                        isActive
                          ? "text-[#A78BFA]"
                          : "text-[#9CA3AF] hover:text-white"
                      }`}
                      style={{ paddingInlineStart: isNested ? "26px" : "14px" }}
                    >
                      {/* Vertical line indicator */}
                      {isNested && (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            className="absolute -top-1.5 start-0 size-4 rtl:-scale-x-100"
                          >
                            <line
                              x1={hasNestedBefore ? "10" : "0"}
                              y1="0"
                              x2={hasNestedBefore ? "0" : "10"}
                              y2="12"
                              className="stroke-white/10"
                              strokeWidth="1"
                            />
                          </svg>
                          <div
                            className={`absolute inset-y-0 w-px bg-white/10 ${
                              hasNestedAfter ? "top-1.5" : ""
                            } ${hasNestedBefore ? "bottom-1.5" : ""}`}
                            style={{ insetInlineStart: "10px" }}
                          />
                        </>
                      )}
                      {!isNested && (
                        <div
                          className={`absolute inset-y-0 w-px bg-white/10 ${
                            isFirst ? "" : "top-1.5"
                          } ${isLast ? "bottom-1.5" : ""}`}
                          style={{ insetInlineStart: "0px" }}
                        />
                      )}
                      {item.title}
                    </a>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
