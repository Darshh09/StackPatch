"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { TrustStrip } from "@/components/sections/trust-strip";
// Unused imports commented out for future use
// import { PatchesSection } from "@/components/sections/patches-section";
// import { DiffPreviewSection } from "@/components/sections/diff-preview-section";
// import { WhyStackPatchSection } from "@/components/sections/why-stackpatch-section";
// import { ForWhoSection } from "@/components/sections/for-who-section";
// import { HowStackPatchWorksSection } from "@/components/sections/how-stackpatch-works-section";
// import { FrameworksIntegrationsSection } from "@/components/sections/frameworks-integrations-section";
import { StackPatchFeaturesSection } from "@/components/sections/stackpatch-features-section";
import { WorkflowSection } from "@/components/sections/workflow-section";
import { Footer } from "@/components/sections/footer";
import { RevertDemo } from "@/components/revert-demo";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const command = "npx stackpatch add auth";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar command={command} onCopyCommand={() => copyToClipboard(command)} />

      <HeroSection
        command={command}
        copied={copied}
        onCopy={() => copyToClipboard(command)}
      />

      <TrustStrip />

      <StackPatchFeaturesSection />

      <WorkflowSection />

      {/* Revert Feature Section */}
      <section className="py-20 px-4 border-y border-border">
        <div className="w-[76.75rem] max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-2rem)] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 font-heading">
              Fully Reversible
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Changed your mind? No problem. StackPatch tracks every change it makes,
              allowing you to safely revert any installation with a single command.
            </p>
          </div>

          <RevertDemo />

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              All changes are tracked in <code className="bg-muted px-1.5 py-0.5 rounded text-xs">.stackpatch/manifest.json</code> for safe reversion
            </p>
          </div>
        </div>
      </section>

     {/*  <FrameworksIntegrationsSection /> */}

      <Footer />
    </div>
  );
}
