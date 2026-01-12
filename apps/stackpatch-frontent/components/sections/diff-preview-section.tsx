"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

export function DiffPreviewSection() {
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
            No magic. Just clean, readable code.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#161B22] border border-red-500/30 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <X className="w-5 h-5 text-red-500" />
              <h3 className="font-heading text-lg font-semibold text-red-400">BEFORE</h3>
            </div>
            <div className="font-mono text-sm space-y-1">
              <div className="text-[#9CA3AF]">/app</div>
              <div className="ml-4 text-white">page.tsx</div>
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#161B22] border border-[#06B6D4]/50 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-[#06B6D4]" />
              <h3 className="font-heading text-lg font-semibold text-[#06B6D4]">AFTER</h3>
            </div>
            <div className="font-mono text-sm space-y-1">
              <div className="text-[#9CA3AF]">/app</div>
              <div className="ml-4 text-[#9CA3AF]">api/auth/[...nextauth]/</div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="ml-8 text-[#06B6D4]"
              >
                route.ts
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="ml-4 text-[#06B6D4]"
              >
                providers.ts
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="ml-4 text-[#06B6D4]"
              >
                auth.config.ts
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
