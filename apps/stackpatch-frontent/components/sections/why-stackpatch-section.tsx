"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

export function WhyStackPatchSection() {
  return (
    <section className="py-24 px-4 border-y border-border">
      <div className="w-[76.75rem] max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-2rem)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Why StackPatch?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Boilerplates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#161B22] border border-red-500/30 rounded-xl p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <X className="w-8 h-8 text-red-500" />
              <h3 className="font-heading text-2xl font-semibold">Boilerplates</h3>
            </div>
            <ul className="space-y-2 text-[#9CA3AF]">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Too heavy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Lock-in</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Overkill</span>
              </li>
            </ul>
          </motion.div>

          {/* Copy-paste */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#161B22] border border-yellow-500/30 rounded-xl p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <X className="w-8 h-8 text-yellow-500" />
              <h3 className="font-heading text-2xl font-semibold">Copy-paste</h3>
            </div>
            <ul className="space-y-2 text-[#9CA3AF]">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span>Error-prone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span>Inconsistent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span>Time-wasting</span>
              </li>
            </ul>
          </motion.div>

          {/* StackPatch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#161B22] border border-[#06B6D4]/50 rounded-xl p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Check className="w-8 h-8 text-[#06B6D4]" />
              <h3 className="font-heading text-2xl font-semibold text-[#06B6D4]">StackPatch</h3>
            </div>
            <ul className="space-y-2 text-[#9CA3AF]">
              <li className="flex items-start gap-2">
                <span className="text-[#06B6D4] mt-1">•</span>
                <span>Modular</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#06B6D4] mt-1">•</span>
                <span>Transparent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#06B6D4] mt-1">•</span>
                <span>Fast</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
