"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Github, Star } from "lucide-react";

export function TrustStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 px-4 border-y border-border bg-muted/30">
      <div className="w-[76.75rem] max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-2rem)] mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm text-muted-foreground">
          {/* Next.js Logo and Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-2">
              {/* Next.js Logo with Animation */}
              <motion.svg
                width="40"
                height="40"
                viewBox="0 0 16 16"
                strokeLinejoin="round"
                style={{ color: "currentColor" }}
                xmlns="http://www.w3.org/2000/svg"
                className="text-foreground"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <defs>
                  <linearGradient id="paint0_linear_nextjs" x1="11.13" y1="5" x2="11.13" y2="11" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="0.609375" stopColor="white" stopOpacity="0.57" />
                    <stop offset="0.796875" stopColor="white" stopOpacity="0" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_nextjs" x1="9.9375" y1="9.0625" x2="13.5574" y2="13.3992" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="clip0_nextjs">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
                <g clipPath="url(#clip0_nextjs)">
                  <motion.circle
                    cx="8"
                    cy="8"
                    r="7.375"
                    fill="black"
                    stroke="var(--ds-gray-1000, currentColor)"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.3, type: "spring" }}
                  />
                  <motion.path
                    d="M10.63 11V5"
                    stroke="url(#paint0_linear_nextjs)"
                    strokeWidth="1.25"
                    strokeMiterlimit="1.41421"
                    initial={{ pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  />
                  <motion.path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.995 5.00087V5H4.745V11H5.995V6.96798L12.3615 14.7076C12.712 14.4793 13.0434 14.2242 13.353 13.9453L5.99527 5.00065L5.995 5.00087Z"
                    fill="url(#paint1_linear_nextjs)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  />
                </g>
              </motion.svg>
              <motion.span
                className="text-foreground font-semibold"
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                Next.js
              </motion.span>
            </div>
            <motion.span
              className="text-muted-foreground"
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              +
            </motion.span>
            <div className="flex items-center gap-2">
              {/* NextAuth Logo with Animation */}
              <motion.svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-foreground"
                initial={{ opacity: 0, rotate: -180 }}
                animate={inView ? { opacity: 1, rotate: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
              >
                <motion.path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  fill="currentColor"
                  opacity="0.8"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 }}
                />
                <motion.path
                  d="M2 17L12 22L22 17V12L12 17L2 12V17Z"
                  fill="currentColor"
                  opacity="0.6"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.9 }}
                />
                <motion.path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1.1 }}
                />
              </motion.svg>
              <motion.span
                className="text-foreground font-semibold"
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                NextAuth.js
              </motion.span>
            </div>
          </motion.div>

          <motion.div
            className="w-px h-6 bg-border"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.4, delay: 1.2 }}
          />

          {/* Punchline with Text Animation */}
          <motion.div
            className="flex items-center gap-2 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <motion.span
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 1.4 }}
            >
              Build production-ready
            </motion.span>
            <motion.span
              className="text-foreground font-semibold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 1.5, type: "spring" }}
            >
              authentication
            </motion.span>
            <motion.span
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 1.6 }}
            >
              in minutes
            </motion.span>
          </motion.div>

          <motion.div
            className="w-px h-6 bg-border"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.4, delay: 1.7 }}
          />

          {/* GitHub Stars with Animation */}
          <motion.div
            className="flex items-center gap-2 relative"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            <motion.div
              animate={inView ? { rotate: [0, -10, 10, -10, 0] } : {}}
              transition={{ duration: 0.5, delay: 2 }}
            >
              <Github className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <a
              href="https://github.com/Darshh09/StackPatch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-foreground font-semibold hover:text-primary transition-colors group relative"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 2.1 }}
              >
                Star on GitHub
              </motion.span>
              <motion.div
                className="flex items-center gap-1 relative"
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 2.2 }}
              >
                {/* Star Particle Container */}
                {inView && <StarParticles />}
                <motion.div
                  animate={inView ? { rotate: [0, 15, -15, 15, 0] } : {}}
                  transition={{ duration: 0.6, delay: 2.3 }}
                >
                  <Star className="w-3.5 h-3.5 fill-primary text-primary relative z-10" />
                </motion.div>
              </motion.div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StarParticles() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; endX: number; endY: number; rotation: number }>>([]);

  useEffect(() => {
    // Create initial stars with staggered delays
    const initialStars = Array.from({ length: 2 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 15,
      endX: (Math.random() - 0.5) * 30,
      endY: -35 - Math.random() * 15,
      rotation: Math.random() * 360,
    }));
    setStars(initialStars);

    // Continuously add new stars
    const interval = setInterval(() => {
      setStars((prev) => {
        const newStar = {
          id: Date.now() + Math.random(),
          x: (Math.random() - 0.5) * 15,
          endX: (Math.random() - 0.5) * 30,
          endY: -35 - Math.random() * 15,
          rotation: Math.random() * 360,
        };
        // Keep only last 6 stars for smooth animation
        return [...prev.slice(-5), newStar];
      });
    }, 600); // Spawn a new star every 600ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-visible w-0 h-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          initial={{
            opacity: 0,
            scale: 0,
            x: star.x,
            y: 0,
            rotate: 0,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.3, 1, 0.6],
            x: star.endX,
            y: star.endY,
            rotate: star.rotation,
          }}
          transition={{
            duration: 1.8,
            ease: [0.16, 1, 0.3, 1], // Custom easing for smooth float
          }}
        >
          <Star className="w-3.5 h-3.5 fill-primary text-primary drop-shadow-lg" />
        </motion.div>
      ))}
    </div>
  );
}
