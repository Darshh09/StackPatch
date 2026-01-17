"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Github, Star } from "lucide-react";
import { kFormatter } from "@/lib/utils";

export function TrustStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [githubStars, setGithubStars] = useState<string | null>(null);

  useEffect(() => {
    async function getGitHubStars() {
      try {
        const response = await fetch(
          "https://api.github.com/repos/Darshh09/StackPatch",
          {
            next: {
              revalidate: 60,
            },
          },
        );
        if (!response?.ok) {
          return null;
        }
        const json = await response.json();
        const stars = parseInt(json.stargazers_count).toLocaleString();
        setGithubStars(stars);
      } catch {
        setGithubStars(null);
      }
    }
    getGitHubStars();
  }, []);

  return (
    <section ref={ref} className="py-12 sm:py-16 md:py-20 px-5 md:px-4 sm:px-6 lg:px-8 border-y border-neutral-700 bg-muted/30">
      <div className="w-[76.75rem] max-w-[calc(100vw-2.5rem)] md:max-w-[calc(100vw-2rem)] mx-auto">

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-muted-foreground">
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
              {/* Better Auth Logo with Animation */}
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
                Better Auth
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
          <GithubStat stars={githubStars} inView={inView} />
        </div>
      </div>
    </section>
  );
}

function GithubStat({ stars, inView }: { stars: string | null; inView: boolean }) {
  let result = 0;
  if (stars) {
    result = parseInt(stars?.replace(/,/g, ""), 10);
  } else {
    return (
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
        </a>
      </motion.div>
    );
  }

  return (
    <motion.a
      href="https://github.com/Darshh09/StackPatch"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Star StackPatch on GitHub - ${kFormatter(result)} stars`}
      className="flex border border-input shadow-sm hover:bg-accent hover:text-accent-foreground rounded-none h-10 overflow-hidden items-center text-sm font-medium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-transparent dark:text-white text-black px-4 py-2 whitespace-pre md:flex group relative justify-center gap-2 transition-all duration-300 ease-out hover:ring-black"
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 1.8 }}
    >
      <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 dark:bg-[#a78bfa]/60 bg-black/60 opacity-40 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
      <div className="flex items-center ml-2">
        <svg
          className="w-4 h-4 fill-current"
          viewBox="0 0 438.549 438.549"
          aria-hidden="true"
        >
          <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"></path>
        </svg>
        <span className="ml-2 text-black dark:text-white">Star on GitHub</span>
      </div>
      <div className="ml-2 flex items-center gap-2 text-sm md:flex">
        <svg
          className="w-4 h-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300"
          data-slot="icon"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
            fillRule="evenodd"
          ></path>
        </svg>
        <span className="inline-block tabular-nums tracking-wider font-mono font-medium text-black dark:text-white">
          {kFormatter(result)}
        </span>
      </div>
    </motion.a>
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
