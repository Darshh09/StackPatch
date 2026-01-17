import fs from "fs";
import path from "path";
import { BOILERPLATE_ROOT } from "../config.js";
import { detectAppDirectory, detectComponentsDirectory } from "../utils/paths.js";

/**
 * Copy protected route files
 */
export async function copyProtectedRouteFiles(target: string): Promise<void> {
  const protectedRouteSrc = path.join(BOILERPLATE_ROOT, "auth/components/protected-route.tsx");
  const middlewareSrc = path.join(BOILERPLATE_ROOT, "auth/middleware.ts");

  const componentsDir = detectComponentsDirectory(target);
  const componentsDirPath = path.join(target, componentsDir);
  const protectedRouteDest = path.join(componentsDirPath, "protected-route.tsx");
  const middlewareDest = path.join(target, "middleware.ts");

  // Ensure components directory exists
  if (!fs.existsSync(componentsDirPath)) {
    fs.mkdirSync(componentsDirPath, { recursive: true });
  }

  // Copy protected route component
  if (fs.existsSync(protectedRouteSrc)) {
    fs.copyFileSync(protectedRouteSrc, protectedRouteDest);
  }

  // Copy middleware (only if it doesn't exist)
  if (fs.existsSync(middlewareSrc) && !fs.existsSync(middlewareDest)) {
    fs.copyFileSync(middlewareSrc, middlewareDest);
  }

  // Auth navbar is not copied by default - it's available in boilerplate if needed
  // Users can manually copy it if they want to use it

  // Copy example pages (only if they don't exist)
  const appDir = detectAppDirectory(target);
  const dashboardPageSrc = path.join(BOILERPLATE_ROOT, "auth/app/dashboard/page.tsx");
  const landingPageSrc = path.join(BOILERPLATE_ROOT, "auth/app/page.tsx");
  const dashboardPageDest = path.join(target, appDir, "dashboard/page.tsx");
  const landingPageDest = path.join(target, appDir, "page.tsx");

  // Create dashboard directory if needed
  const dashboardDir = path.join(target, appDir, "dashboard");
  if (!fs.existsSync(dashboardDir)) {
    fs.mkdirSync(dashboardDir, { recursive: true });
  }

  // Copy dashboard page (only if it doesn't exist)
  if (fs.existsSync(dashboardPageSrc) && !fs.existsSync(dashboardPageDest)) {
    fs.copyFileSync(dashboardPageSrc, dashboardPageDest);
  }

  // Copy landing page (only if it doesn't exist or is default)
  if (fs.existsSync(landingPageSrc)) {
    // Check if current page is just a default Next.js page
    if (fs.existsSync(landingPageDest)) {
      const currentContent = fs.readFileSync(landingPageDest, "utf-8");
      // Only replace if it's the default Next.js page
      if (currentContent.includes("Get started by editing") || currentContent.length < 500) {
        fs.copyFileSync(landingPageSrc, landingPageDest);
      }
    } else {
      fs.copyFileSync(landingPageSrc, landingPageDest);
    }
  }
}
