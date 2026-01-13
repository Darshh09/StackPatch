"use client";

import { motion } from "framer-motion";
import { Scan, GitBranch, Lock } from "lucide-react";

export function HowStackPatchWorksSection() {
  const steps = [
    {
      icon: Scan,
      title: "Step 1 — Detect",
      description: "Detects your app structure and understands your existing codebase",
    },
    {
      icon: GitBranch,
      title: "Step 2 — Patch",
      description: "Injects only what's needed, respecting your existing code structure",
    },
    {
      icon: Lock,
      title: "Step 3 — Own it",
      description: "You fully own the code. No magic, no black boxes, just clean code in your repo",
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="w-[76.75rem] max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-2rem)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            How StackPatch Works
          </h2>
          <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto">
            Three simple steps to add production-ready features to your app
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-[#161B22] border border-white/10 rounded-xl p-8 hover:border-[#A78BFA]/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-[#A78BFA]/20 flex items-center justify-center mb-6 group-hover:bg-[#A78BFA]/30 transition-colors">
                    <Icon className="w-6 h-6 text-[#A78BFA]" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-[#9CA3AF] leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
