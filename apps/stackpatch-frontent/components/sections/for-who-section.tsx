"use client";

import { motion } from "framer-motion";

export function ForWhoSection() {
  const testimonials = [
    { quote: "I just wanted auth — not a framework.", author: "Indie hacker" },
    { quote: "Finally, a tool that respects my existing codebase.", author: "Frontend engineer" },
    { quote: "StackPatch saved us weeks of integration work.", author: "Startup team" },
    { quote: "The transparency is what sold me. I own every line.", author: "OSS builder" },
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
            Built for builders
          </h2>
          <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto mb-8">
            Indie hackers, frontend engineers, OSS builders, and startup teams
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#161B22] border border-white/10 rounded-xl p-6"
            >
              <p className="text-[#9CA3AF] italic mb-4">"{testimonial.quote}"</p>
              <p className="text-sm text-white/70">— {testimonial.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
