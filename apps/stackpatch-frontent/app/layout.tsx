import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { RootProvider } from 'fumadocs-ui/provider/next';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StackPatch - Composable frontend features for modern React & Next.js",
  // description: "Add production-ready frontend features to existing projects without restructuring. Think shadcn/ui, but for complete features instead of components.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased flex flex-col min-h-screen`}
      >
        <RootProvider
          search={{
            options: {
              type: "fetch",
              api: "/api/search",
            },
          }}
          theme={{
            enableSystem: true,
            defaultTheme: "system",
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
