"use client";

export function FrameworksIntegrationsSection() {
  const frameworks = [
    { name: "Next.js", icon: "⚡" },
    { name: "React", icon: "⚛️" },
    { name: "Vite", icon: "⚡" },
    { name: "Remix", icon: "🔄" },
    { name: "SvelteKit", icon: "🎯" },
    { name: "Astro", icon: "🚀" },
  ];

  const integrations = [
    { name: "Better Auth", icon: "🔐" },
    { name: "Upstash", icon: "⚡" },
    { name: "Stripe", icon: "💳" },
    { name: "TanStack Query", icon: "🔁" },
    { name: "Prisma", icon: "🗄️" },
    { name: "Resend", icon: "📧" },
  ];

  return (
    <section className="py-24 px-4 border-y border-border">
      <div className="w-[76.75rem] max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-2rem)] mx-auto">
        <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-2 xl:gap-x-16">
          {/* Frameworks Section */}
          <div className="w-full text-center">
            <h2 className="text-sm font-medium text-[#A78BFA]">Frameworks</h2>
            <p className="mx-auto mt-4 max-w-md text-balance text-3xl font-heading font-semibold tracking-[-0.015em] text-white">
              Works with your favorite frameworks
            </p>
            <p className="mx-auto mb-6 mt-4 max-w-md text-base/6 text-[#9CA3AF]">
              StackPatch integrates seamlessly with modern frameworks, adding features without disrupting your existing setup.
            </p>
            <a
              href="#patches"
              className="group relative isolate inline-flex items-center justify-center overflow-hidden text-left font-medium transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] text-white text-sm"
            >
              View all frameworks
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
          </div>

          {/* Frameworks Grid */}
          <div className="relative -mr-[3px] mt-16 flex flex-auto flex-wrap pl-px pt-px">
            {frameworks.map((framework, index) => (
              <div
                key={framework.name}
                className="group relative -ml-px -mt-px flex flex-none items-center justify-center border bg-[#161B22] py-8 transition-[border-color,z-index] delay-150 hover:delay-0 hover:duration-300 border-white/10 w-1/2 sm:w-1/3 hover:border-[#A78BFA]/50"
                style={{ zIndex: index }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-[84%]"></div>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(42.89% 50%, rgba(10, 10, 10, 0.8) 8.57%, rgba(10, 10, 10, 0) 100%)",
                  }}
                ></div>
                <div className="relative flex w-full flex-col items-center">
                  <div className="relative aspect-[104/42] w-[calc(104/16*1rem)] max-w-full translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity duration-500 group-hover:opacity-0">
                      <span className="text-4xl opacity-60">{framework.icon}</span>
                    </div>
                    <div className="absolute inset-0 h-full w-full flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <span className="text-4xl">{framework.icon}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:delay-75">
                    {framework.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Integrations Section */}
          <div className="mt-24 w-full text-center lg:col-start-2 lg:row-start-1 lg:mt-0">
            <h2 className="text-sm font-medium text-[#06B6D4]">Integrations</h2>
            <p className="mx-auto mt-4 max-w-md text-balance text-3xl font-heading font-semibold tracking-[-0.015em] text-white">
              Integrate with the tools you love
            </p>
            <p className="mx-auto mb-6 mt-4 max-w-md text-base/6 text-[#9CA3AF]">
              StackPatch patches work with popular libraries and services you already use in production.
            </p>
            <a
              href="#patches"
              className="group relative isolate inline-flex items-center justify-center overflow-hidden text-left font-medium transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] text-white text-sm"
            >
              View all integrations
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
          </div>

          {/* Integrations Grid */}
          <div className="relative -mr-[3px] mt-16 flex flex-auto flex-wrap pl-px pt-px">
            {integrations.map((integration, index) => (
              <div
                key={integration.name}
                className="group relative -ml-px -mt-px flex flex-none items-center justify-center border bg-[#161B22] py-8 transition-[border-color,z-index] delay-150 hover:delay-0 hover:duration-300 border-white/10 w-1/2 sm:w-1/3 hover:border-[#06B6D4]/50"
                style={{ zIndex: index }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-[84%]"></div>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(57.49% 50%, rgba(10, 10, 10, 0.8) 34.41%, rgba(10, 10, 10, 0) 100%)",
                  }}
                ></div>
                <div className="relative flex w-full flex-col items-center">
                  <div className="relative aspect-[104/42] w-[calc(104/16*1rem)] max-w-full translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity duration-500 group-hover:opacity-0">
                      <span className="text-4xl opacity-60">{integration.icon}</span>
                    </div>
                    <div className="absolute inset-0 h-full w-full flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <span className="text-4xl">{integration.icon}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:delay-75">
                    {integration.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
