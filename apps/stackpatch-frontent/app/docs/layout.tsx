import type { ReactNode } from "react";

import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/notebook";

import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

const base = baseOptions();

const docsOptions: DocsLayoutProps = {
  ...base,
  tree: source.pageTree,
  nav: {
    ...base.nav,
    mode: "top",
    transparentMode: "always",
  },
  sidebar: {

    tabs: false,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsLayout {...docsOptions}>{children}</DocsLayout>;
}
