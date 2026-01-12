"use client";

import { motion } from "framer-motion";
import { AuthPreview } from "@/components/auth-preview";

export function AuthPreviewSection() {
  return (
    <section className="relative overflow-hidden border-y border-border">
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-center w-full px-6"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-white">
            See what you'll get
          </h2>
          <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto">
            Beautiful, production-ready auth pages that come with every StackPatch installation
          </p>
        </motion.div>
      </div>
      <AuthPreview />
    </section>
  );
}
