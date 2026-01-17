"use client";

import { motion } from "framer-motion";

export function PatchesSection() {
  const patches = [
    {
      icon: "🔐",
      title: "Auth",
      description: "Better Auth integration",
      files: [
        "app/",
        "api/auth/[...all]/",
        "route.ts",
        "lib/",
        "auth.ts",
        "protected-routes.ts",
      ],
    },
    {
      icon: "⚡",
      title: "Redis",
      description: "Upstash + caching utils",
      files: ["lib/", "redis.ts", "cache.ts", "utils.ts"],
    },
    {
      icon: "🔁",
      title: "TanStack Query",
      description: "Server + client setup",
      files: ["lib/", "query-client.ts", "providers.tsx", "hooks/", "use-query.ts"],
    },
    {
      icon: "💳",
      title: "Stripe",
      description: "Webhooks + checkout",
      files: ["app/api/", "webhooks/stripe/", "route.ts", "checkout.ts"],
    },
  ];

  return (
    <section id="patches" className=" border-y border-border">
       <div className="w-[76.75rem] max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-2rem)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className=" mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Pick a patch. Ship faster.
          </h2>
          <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto">
            Production-ready features that integrate seamlessly into your existing codebase
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {patches.map((patch, index) => (
            <motion.div
              key={patch.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-[#161B22] border border-white/10 rounded-xl p-6 hover:border-[#A78BFA]/50 transition-all cursor-pointer h-full flex flex-col">
                <div className="text-4xl mb-4">{patch.icon}</div>
                <h3 className="font-heading text-xl font-semibold mb-2">{patch.title}</h3>
                <p className="text-[#9CA3AF] text-sm mb-4 flex-1">{patch.description}</p>
                <button className="w-full px-4 py-2 bg-[#A78BFA]/10 hover:bg-[#A78BFA]/20 text-[#A78BFA] font-semibold rounded-lg transition-colors text-sm">
                  Add patch
                </button>

                {/* Hover Preview */}
                <div className="absolute inset-0 bg-[#0A0A0A] border border-[#A78BFA]/50 rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="text-xs font-mono text-white space-y-1">
                    {patch.files.map((file, fileIndex) => (
                      <div
                        key={fileIndex}
                        className={fileIndex === 0 || fileIndex === 1 ? "text-[#9CA3AF]" : "text-[#06B6D4]"}
                        style={{
                          marginLeft: fileIndex === 0 ? "0" : fileIndex === 1 ? "8px" : fileIndex === 2 ? "16px" : "8px",
                        }}
                      >
                        {file}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
