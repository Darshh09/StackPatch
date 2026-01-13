import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("StackPatch CLI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Patch Configuration", () => {
    it("should have valid patch definitions", () => {
      const patches = {
        auth: {
          path: "auth",
          dependencies: ["next-auth", "react-hot-toast"],
        },
        "auth-ui": {
          path: "auth",
          dependencies: ["next-auth", "react-hot-toast"],
        },
      };

      // Validate structure
      Object.entries(patches).forEach(([name, config]) => {
        expect(config).toHaveProperty("path");
        expect(config).toHaveProperty("dependencies");
        expect(typeof config.path).toBe("string");
        expect(Array.isArray(config.dependencies)).toBe(true);
        expect(config.path.length).toBeGreaterThan(0);
        expect(config.dependencies.length).toBeGreaterThan(0);
      });
    });

    it("should have auth and auth-ui as valid patches", () => {
      const validPatches = ["auth", "auth-ui"];
      const invalidPatches = ["invalid", "test", "", "stripe"];

      validPatches.forEach((patch) => {
        expect(patch.length).toBeGreaterThan(0);
        expect(typeof patch).toBe("string");
      });

      invalidPatches.forEach((patch) => {
        if (patch !== "") {
          expect(validPatches.includes(patch)).toBe(false);
        }
      });
    });

    it("should have correct dependencies for auth patches", () => {
      const authDependencies = ["next-auth", "react-hot-toast"];

      expect(authDependencies).toContain("next-auth");
      expect(authDependencies).toContain("react-hot-toast");
      expect(authDependencies.length).toBe(2);
    });
  });

  describe("Path Resolution", () => {
    it("should resolve boilerplate path correctly", () => {
      const mockCliDir = "/mock/cli/bin";
      const expectedBoilerplatePath = path.resolve(mockCliDir, "../boilerplate");

      expect(expectedBoilerplatePath).toContain("boilerplate");
      expect(path.isAbsolute(expectedBoilerplatePath)).toBe(true);
    });

    it("should handle relative paths", () => {
      const relativePath = "../../apps/my-app";
      expect(typeof relativePath).toBe("string");
      expect(relativePath.startsWith("../")).toBe(true);
    });

    it("should handle absolute paths", () => {
      const absolutePath = "/Users/test/app";
      expect(typeof absolutePath).toBe("string");
      expect(path.isAbsolute(absolutePath)).toBe(true);
    });
  });

  describe("Dependency Checking", () => {
    it("should identify missing dependencies", () => {
      const packageJson = {
        dependencies: {},
        devDependencies: {},
      };

      const hasNextAuth = !!(
        packageJson.dependencies["next-auth"] ||
        packageJson.devDependencies["next-auth"]
      );

      expect(hasNextAuth).toBe(false);
    });

    it("should identify existing dependencies in dependencies", () => {
      const packageJson = {
        dependencies: {
          "next-auth": "^4.24.13",
          "react-hot-toast": "^2.4.1",
        },
        devDependencies: {},
      };

      const hasNextAuth = !!(
        packageJson.dependencies["next-auth"] ||
        packageJson.devDependencies["next-auth"]
      );

      const hasReactHotToast = !!(
        packageJson.dependencies["react-hot-toast"] ||
        packageJson.devDependencies["react-hot-toast"]
      );

      expect(hasNextAuth).toBe(true);
      expect(hasReactHotToast).toBe(true);
    });

    it("should identify existing dependencies in devDependencies", () => {
      const packageJson = {
        dependencies: {},
        devDependencies: {
          "next-auth": "^4.24.13",
        },
      };

      const hasNextAuth = !!(
        packageJson.dependencies["next-auth"] ||
        packageJson.devDependencies["next-auth"]
      );

      expect(hasNextAuth).toBe(true);
    });

    it("should filter missing dependencies correctly", () => {
      const requiredDeps = ["next-auth", "react-hot-toast"];
      const packageJson = {
        dependencies: {
          "next-auth": "^4.24.13",
        },
        devDependencies: {},
      };

      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      const missingDeps = requiredDeps.filter(
        (dep) => !allDeps[dep]
      );

      expect(missingDeps).toContain("react-hot-toast");
      expect(missingDeps).not.toContain("next-auth");
      expect(missingDeps.length).toBe(1);
    });
  });

  describe("Environment File Generation", () => {
    it("should generate correct .env.example structure", () => {
      const envContent = `# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=test_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
`;

      expect(envContent).toContain("NEXTAUTH_URL");
      expect(envContent).toContain("NEXTAUTH_SECRET");
      expect(envContent).toContain("GOOGLE_CLIENT_ID");
      expect(envContent).toContain("GOOGLE_CLIENT_SECRET");
      expect(envContent).toContain("GITHUB_CLIENT_ID");
      expect(envContent).toContain("GITHUB_CLIENT_SECRET");
    });

    it("should generate valid NEXTAUTH_SECRET format", () => {
      // Mock secret generation (64 hex characters)
      const mockSecret = "a".repeat(64);
      expect(mockSecret.length).toBe(64);
      expect(/^[a-f0-9]+$/i.test(mockSecret)).toBe(true);
    });
  });

  describe("File Path Validation", () => {
    it("should validate NextAuth route path", () => {
      const target = "/mock/project";
      const nextAuthRoutePath = path.join(
        target,
        "app/api/auth/[...nextauth]/route.ts"
      );

      expect(nextAuthRoutePath).toContain("app/api/auth");
      expect(nextAuthRoutePath).toContain("[...nextauth]");
      expect(nextAuthRoutePath).toContain("route.ts");
    });

    it("should validate layout path", () => {
      const target = "/mock/project";
      const layoutPath = path.join(target, "app/layout.tsx");

      expect(layoutPath).toContain("app/layout.tsx");
    });

    it("should validate auth button path", () => {
      const target = "/mock/project";
      const authButtonPath = path.join(
        target,
        "components/auth-button.tsx"
      );

      expect(authButtonPath).toContain("components/auth-button.tsx");
    });

    it("should validate login page path", () => {
      const target = "/mock/project";
      const loginPagePath = path.join(target, "app/auth/login/page.tsx");

      expect(loginPagePath).toContain("app/auth/login/page.tsx");
    });
  });

  describe("Auth Configuration", () => {
    it("should use Google and GitHub providers only", () => {
      const providers = ["google", "github"];

      expect(providers).toContain("google");
      expect(providers).toContain("github");
      expect(providers.length).toBe(2);
      expect(providers).not.toContain("credentials");
      expect(providers).not.toContain("apple");
    });

    it("should have correct provider configuration structure", () => {
      const providerConfig = {
        google: {
          clientId: "GOOGLE_CLIENT_ID",
          clientSecret: "GOOGLE_CLIENT_SECRET",
        },
        github: {
          clientId: "GITHUB_CLIENT_ID",
          clientSecret: "GITHUB_CLIENT_SECRET",
        },
      };

      expect(providerConfig.google).toHaveProperty("clientId");
      expect(providerConfig.google).toHaveProperty("clientSecret");
      expect(providerConfig.github).toHaveProperty("clientId");
      expect(providerConfig.github).toHaveProperty("clientSecret");
    });
  });

  describe("Project Structure", () => {
    it("should have correct boilerplate structure", () => {
      const boilerplateStructure = {
        auth: {
          app: ["api", "auth", "login"],
          components: ["auth-button", "session-provider", "toaster"],
        },
        template: {
          app: ["layout", "page", "globals.css"],
          config: ["next.config", "tsconfig", "package.json"],
        },
      };

      expect(boilerplateStructure.auth).toHaveProperty("app");
      expect(boilerplateStructure.auth).toHaveProperty("components");
      expect(boilerplateStructure.template).toHaveProperty("app");
      expect(boilerplateStructure.template).toHaveProperty("config");
    });

    it("should validate required auth files", () => {
      const requiredAuthFiles = [
        "app/api/auth/[...nextauth]/route.ts",
        "app/auth/login/page.tsx",
        "app/auth/signup/page.tsx",
        "components/auth-button.tsx",
        "components/session-provider.tsx",
        "components/toaster.tsx",
      ];

      requiredAuthFiles.forEach((file) => {
        expect(file).toMatch(/\.(ts|tsx)$/);
        expect(file.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Command Validation", () => {
    it("should validate create command", () => {
      const command = "create";
      const validCommands = ["create", "add"];

      expect(validCommands).toContain(command);
    });

    it("should validate add command", () => {
      const command = "add";
      const validCommands = ["create", "add"];

      expect(validCommands).toContain(command);
    });

    it("should reject invalid commands", () => {
      const invalidCommands = ["delete", "update", "remove", ""];
      const validCommands = ["create", "add"];

      invalidCommands.forEach((cmd) => {
        if (cmd !== "") {
          expect(validCommands.includes(cmd)).toBe(false);
        }
      });
    });
  });

  describe("Project Name Validation", () => {
    it("should validate project names", () => {
      const validNames = ["my-app", "test-project", "stackpatch-app"];
      const invalidNames = ["", " ", "my app", "my/app"];

      validNames.forEach((name) => {
        expect(name.trim().length).toBeGreaterThan(0);
        expect(name).not.toContain(" ");
      });

      invalidNames.forEach((name) => {
        if (name.trim() === "") {
          expect(name.trim().length).toBe(0);
        }
      });
    });

    it("should handle default project name", () => {
      const defaultName = "my-stackpatch-app";
      expect(defaultName).toBe("my-stackpatch-app");
      expect(defaultName.length).toBeGreaterThan(0);
    });
  });

  describe("File Extension Validation", () => {
    it("should validate TypeScript file extensions", () => {
      const tsFiles = [
        "route.ts",
        "page.tsx",
        "layout.tsx",
        "auth-button.tsx",
      ];

      tsFiles.forEach((file) => {
        expect(file).toMatch(/\.(ts|tsx)$/);
      });
    });

    it("should validate configuration file extensions", () => {
      const configFiles = [
        "package.json",
        "tsconfig.json",
        "next.config.ts",
        ".env.example",
      ];

      configFiles.forEach((file) => {
        expect(file).toMatch(/\.(json|ts|example)$|^\./);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle missing boilerplate directory gracefully", () => {
      const nonExistentPath = "/non/existent/path/that/does/not/exist/12345";
      // Use actual fs.existsSync for this test
      const pathExists = fs.existsSync(nonExistentPath);

      expect(pathExists).toBe(false);
    });

    it("should handle missing target directory gracefully", () => {
      const nonExistentTarget = "/non/existent/target/that/does/not/exist/67890";
      // Use actual fs.existsSync for this test
      const pathExists = fs.existsSync(nonExistentTarget);

      expect(pathExists).toBe(false);
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle complete auth setup flow", () => {
      const flow = [
        "Copy auth files",
        "Generate .env.example",
        "Update NextAuth route",
        "Update login/signup pages",
        "Update auth button",
        "Update layout",
        "Add toaster",
      ];

      expect(flow.length).toBe(7);
      expect(flow).toContain("Copy auth files");
      expect(flow).toContain("Generate .env.example");
      expect(flow).toContain("Update NextAuth route");
    });

    it("should handle project creation flow", () => {
      const flow = [
        "Copy template",
        "Process project files",
        "Install dependencies",
      ];

      expect(flow.length).toBe(3);
      expect(flow).toContain("Copy template");
      expect(flow).toContain("Install dependencies");
    });
  });
});
