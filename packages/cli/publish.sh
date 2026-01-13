#!/bin/bash

# StackPatch CLI Publishing Script
# This script helps you publish the CLI package to npm

set -e

echo "🚀 StackPatch CLI Publishing Helper"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this from packages/cli directory"
  exit 1
fi

# Check if logged into npm
if ! npm whoami &> /dev/null; then
  echo "⚠️  You're not logged into npm"
  echo "   Run: npm login"
  exit 1
fi

echo "✅ Logged in as: $(npm whoami)"
echo ""

# Show current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: $CURRENT_VERSION"
echo ""

# Ask for version bump type
echo "What type of version bump?"
echo "1) patch (1.0.0 -> 1.0.1)"
echo "2) minor (1.0.0 -> 1.1.0)"
echo "3) major (1.0.0 -> 2.0.0)"
echo "4) custom (enter version manually)"
echo ""
read -p "Choose [1-4]: " version_choice

case $version_choice in
  1)
    npm version patch
    ;;
  2)
    npm version minor
    ;;
  3)
    npm version major
    ;;
  4)
    read -p "Enter version (e.g., 1.2.3): " custom_version
    npm version "$custom_version"
    ;;
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

# Run prepublish script
echo ""
echo "📋 Running prepublish script..."
npm run prepublishOnly

# Show what will be published
echo ""
echo "📦 Files that will be published:"
npm pack --dry-run 2>&1 | grep -A 100 "npm notice === Tarball Contents ===" || true

# Confirm before publishing
echo ""
read -p "🤔 Ready to publish? [y/N]: " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
  echo "❌ Publishing cancelled"
  exit 1
fi

# Publish
echo ""
echo "🚀 Publishing to npm..."
npm publish

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo ""
echo "✅ Successfully published stackpatch@$NEW_VERSION"
echo ""
echo "🔗 View on npm: https://www.npmjs.com/package/stackpatch"
echo ""
echo "🧪 Test installation:"
echo "   npx stackpatch@latest add auth"
