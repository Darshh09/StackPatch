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

     {/*  <FrameworksIntegrationsSection /> */}

      <Footer />
    </div>
  );
}
