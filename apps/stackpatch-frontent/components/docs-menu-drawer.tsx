"use client";

import { useState } from "react";
import { X, FileText, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

interface DocsMenuDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DocsItem {
  name: string;
  url: string;
  children?: DocsItem[];
}

const docsStructure: DocsItem[] = [
  {
    name: "Quick Start",
    url: "/docs/quick-start",
  },
  {
    name: "CLI",
    url: "/docs/cli",
    children: [
      {
        name: "Commands",
        url: "/docs/cli/commands",
      },
    ],
  },
  {
    name: "Guides",
    url: "/docs/guides",
  },
  {
    name: "Project Structure",
    url: "/docs/project-structure",
  },
  {
    name: "Contribution",
    url: "/docs/contribution",
  },
  {
    name: "FAQ",
    url: "/docs/faq",
  },
];

export function DocsMenuDrawer({ open, onOpenChange }: DocsMenuDrawerProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (url: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      return next;
    });
  };

  const renderItem = (item: DocsItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.url);

    if (hasChildren) {
      return (
        <div key={item.url}>
          <button
            onClick={() => toggleExpand(item.url)}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50 rounded-lg transition-colors"
            style={{ paddingLeft: `${level * 0.75 + 1}rem` }}
          >
            <ChevronRight
              className={`w-4 h-4 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
            />
            <span>{item.name}</span>
          </button>
          {isExpanded && (
            <div className="mt-1">
              {item.children!.map((child) => renderItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.url}
        href={item.url}
        onClick={() => onOpenChange(false)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
        style={{ paddingLeft: `${level * 0.75 + 1}rem` }}
      >
        <FileText className="w-4 h-4 shrink-0" />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-background border-r border-border shadow-xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Documentation</h2>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-1">
              {docsStructure.map((item) => renderItem(item))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
