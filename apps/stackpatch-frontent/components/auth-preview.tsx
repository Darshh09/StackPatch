"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Github } from "lucide-react";

export function AuthPreview() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="group mt-30 isolate flex flex-col max-w-7xl mx-auto rounded-2xl shadow-[inset_0_1px,inset_0_0_0_1px] overflow-hidden">
      {/* Header */}
      <div className="relative z-10 flex-none px-6 pt-6">
        <h3 className="text-sm font-medium text-white">Authentication UI</h3>
        <p className="mt-2 text-pretty text-sm/5 text-gray-400">
          StackPatch provides production-ready authentication pages with login, signup, and password recovery flows. Fully customizable and ready to use.
        </p>
      </div>

      {/* Main Preview Area */}
      <div className="relative flex-auto select-none" style={{ minHeight: "10.25rem" }}>
        <div className="relative flex h-full flex-col  py-12">
          {/* Decorative SVG Elements - Left */}
          <svg
            viewBox="0 0 138 248"
            fill="none"
            aria-hidden="true"
            className="absolute left-0 top-1/2 translate-x-295 -translate-y-1/2 ml-1.5 w-52 pointer-events-none"
          >
            <g filter="url(#filter0_bd_auth_left)" shapeRendering="crispEdges">
              <path
                fill="#fff"
                fillOpacity=".04"
                d="M4.229 24.678 23.639 4.46A8 8 0 0 1 29.409 2H198a8 8 0 0 1 8 8v228a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8V30.219a8 8 0 0 1 2.229-5.54Z"
              />
              <path
                stroke="#fff"
                strokeOpacity=".05"
                d="M24 4.806 4.59 25.024a7.5 7.5 0 0 0-2.09 5.194V238a7.5 7.5 0 0 0 7.5 7.5h188a7.5 7.5 0 0 0 7.5-7.5V10a7.5 7.5 0 0 0-7.5-7.5H29.41A7.5 7.5 0 0 0 24 4.806Z"
              />
            </g>
            <defs>
              <filter
                id="filter0_bd_auth_left"
                width="220"
                height="260"
                x="-6"
                y="-6"
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="4" />
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_auth_left" />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="1" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="effect1_backgroundBlur_auth_left" result="effect2_dropShadow_auth_left" />
                <feBlend in="SourceGraphic" in2="effect2_dropShadow_auth_left" result="shape" />
              </filter>
            </defs>
          </svg>

          {/* Decorative SVG Elements - Right */}
          <svg
            viewBox="0 0 208 248"
            fill="none"
            aria-hidden="true"
            className="absolute right-0 top-1/2 -translate-y-1/2 mr-1.5 w-52 -scale-x-100 pointer-events-none"
          >
            <g filter="url(#filter0_bd_auth_right)" shapeRendering="crispEdges">
              <path
                fill="#fff"
                fillOpacity=".04"
                d="M4.229 24.678 23.639 4.46A8 8 0 0 1 29.409 2H198a8 8 0 0 1 8 8v228a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8V30.219a8 8 0 0 1 2.229-5.54Z"
              />
              <path
                stroke="#fff"
                strokeOpacity=".05"
                d="M24 4.806 4.59 25.024a7.5 7.5 0 0 0-2.09 5.194V238a7.5 7.5 0 0 0 7.5 7.5h188a7.5 7.5 0 0 0 7.5-7.5V10a7.5 7.5 0 0 0-7.5-7.5H29.41A7.5 7.5 0 0 0 24 4.806Z"
              />
            </g>
            <defs>
              <filter
                id="filter0_bd_auth_right"
                width="220"
                height="260"
                x="-6"
                y="-6"
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="4" />
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_auth_right" />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="1" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="effect1_backgroundBlur_auth_right" result="effect2_dropShadow_auth_right" />
                <feBlend in="SourceGraphic" in2="effect2_dropShadow_auth_right" result="shape" />
              </filter>
            </defs>
          </svg>

          {/* Connecting Line */}
          <div className="absolute left-1/2 top-[calc(30/16*1rem)] -translate-x-1/2 aspect-[600/87] w-[calc(600/16*1rem)] pointer-events-none">
            <svg
              viewBox="0 20 600 57"
              fill="none"
              aria-hidden="true"
              className="absolute inset-0 size-full stroke-white/5"
            >
              <path d="M0 86h136.686a8 8 0 0 0 5.657-2.343l80.314-80.314A8 8 0 0 1 228.314 1h143.372a8 8 0 0 1 5.657 2.343l80.314 80.314A8 8 0 0 0 463.314 86H600" />
            </svg>
          </div>

          {/* Gradient Background */}
          <div className="absolute inset-0 bg-[radial-gradient(97.14%_100%_at_top,rgba(33,33,38,0)_42.04%,#212126_89.82%)] pointer-events-none"></div>

          {/* Actual Auth Form (Centered) */}
          <div className="relative z-20 flex items-center justify-center px-6 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md"
            >
          <div className="bg-[#161B22] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 border-2 border-[#A78BFA] bg-[#A78BFA]/10 flex items-center justify-center rounded">
                  <span className="text-[#A78BFA] text-sm font-bold">SP</span>
                </div>
              </div>
              <h1 className="text-2xl font-heading font-semibold text-white text-center mb-2">
                {isSignUp ? "Create an account" : "Sign in to your account"}
              </h1>
              <p className="text-sm text-[#9CA3AF] text-center">
                {isSignUp
                  ? "Get started with StackPatch"
                  : "Welcome back! Please sign in to continue"}
              </p>
            </div>

            {/* Social Buttons */}
            <div className="px-6 pb-4">
              <div className="flex flex-col gap-3">
                <button className="flex items-center justify-center gap-3 w-full px-4 py-3 border border-white/10 rounded-lg bg-[#0A0A0A] hover:bg-white/5 transition-colors text-white text-sm font-medium">
                  <Github className="w-5 h-5" />
                  <span>Continue with GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-xs text-[#9CA3AF]">or</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Form */}
              <form className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#A78BFA] transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#A78BFA] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 bg-[#0A0A0A] border border-white/10 rounded-lg text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#A78BFA] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {!isSignUp && (
                  <div className="flex items-center justify-end">
                    <a
                      href="#"
                      className="text-sm text-[#A78BFA] hover:text-[#A78BFA]/80 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                )}

                <motion.button
                  type="submit"
                  className="w-full px-4 py-3 bg-[#A78BFA] text-black font-semibold rounded-lg hover:bg-[#A78BFA]/90 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{isSignUp ? "Create account" : "Continue"}</span>
                  <svg
                    viewBox="0 0 10 10"
                    className="w-4 h-4"
                    fill="currentColor"
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
                </motion.button>
              </form>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                  <span className="text-sm text-[#9CA3AF]">
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                  </span>
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-[#A78BFA] hover:text-[#A78BFA]/80 transition-colors font-medium"
                  >
                    {isSignUp ? "Sign in" : "Sign up"}
                  </button>
                </div>
              </div>
            </div>
          </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
