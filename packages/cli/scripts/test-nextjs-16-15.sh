#!/bin/bash
# Test script to verify Next.js 16+ uses middleware.ts and Next.js < 16 uses proxy.ts
# Note: This script requires manual interaction with the CLI prompts

set -e

CLI_PATH="/Users/darshitshukla/Desktop/mypersonalproduct/StackPatch/packages/cli/dist/stackpatch.js"
TEST_DIR="/Users/darshitshukla/Desktop/test-stackpatch"

echo "🧪 Testing Next.js 16 vs 15 Middleware/Proxy Generation"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Next.js 16+
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 1: Next.js 16+ should create middleware.ts"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

NEXT16_DIR="$TEST_DIR/test-next16-proxy"

if [ -d "$NEXT16_DIR" ]; then
    echo "⚠️  Test directory exists, cleaning up..."
    rm -rf "$NEXT16_DIR"
fi

echo "📦 Creating Next.js 16 project..."
npx create-next-app@latest "$NEXT16_DIR" --typescript --app --no-tailwind --no-git --yes

cd "$NEXT16_DIR"

echo ""
echo "📝 Verifying Next.js version..."
NEXT_VERSION=$(node -p "require('./package.json').dependencies.next")
echo "   Next.js version: $NEXT_VERSION"

MAJOR_VERSION=$(echo "$NEXT_VERSION" | grep -oE '[0-9]+' | head -1)
echo "   Major version: $MAJOR_VERSION"

if [ "$MAJOR_VERSION" -ge 16 ]; then
    echo "   ✅ Next.js 16+ detected"
else
    echo "   ⚠️  Warning: Expected Next.js 16+, but got version $NEXT_VERSION"
fi

echo ""
echo "🚀 Running StackPatch CLI..."
echo "   ⚠️  This requires manual interaction - please answer the prompts:"
echo "   1. Choose session mode: Select option 2 (Stateless)"
echo "   2. Enable Email + Password: Select option 1 (Yes)"
echo "   3. Add OAuth providers: Select GitHub and Google (space to select, enter to confirm)"
echo "   4. Add prebuilt auth UI: Select option 1 (Yes)"
echo "   5. Which route should be protected: Enter /dashboard"
echo "   6. Continue: Select option 1 (yes)"
echo ""
echo "   Press Enter when ready to start..."
read

# Run CLI - user will need to interact
node "$CLI_PATH" add auth

echo ""
echo "🔍 Checking generated files..."

# For Next.js 16+, should create middleware.ts (not proxy.ts)
if [ -f "middleware.ts" ]; then
    echo -e "   ${GREEN}✅ PASSED: middleware.ts exists${NC}"

    # Check export syntax
    if grep -q "export async function middleware" middleware.ts; then
        echo -e "   ${GREEN}✅ PASSED: middleware.ts has correct named export${NC}"
    else
        echo -e "   ${RED}❌ FAILED: middleware.ts does not have named export${NC}"
    fi

    if [ -f "proxy.ts" ]; then
        echo -e "   ${RED}❌ FAILED: proxy.ts should NOT exist for Next.js 16+${NC}"
    else
        echo -e "   ${GREEN}✅ PASSED: proxy.ts correctly does not exist${NC}"
    fi
else
    echo -e "   ${RED}❌ FAILED: middleware.ts does not exist${NC}"
    if [ -f "proxy.ts" ]; then
        echo -e "   ${RED}❌ FAILED: proxy.ts exists (should be middleware.ts for Next.js 16+)${NC}"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 2: Next.js 15 should create proxy.ts"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

NEXT15_DIR="$TEST_DIR/test-next15-middleware"

if [ -d "$NEXT15_DIR" ]; then
    echo "⚠️  Test directory exists, cleaning up..."
    rm -rf "$NEXT15_DIR"
fi

echo "📦 Creating Next.js 15 project..."
npx create-next-app@15 "$NEXT15_DIR" --typescript --app --no-tailwind --no-git --yes

cd "$NEXT15_DIR"

echo ""
echo "📝 Verifying Next.js version..."
NEXT_VERSION=$(node -p "require('./package.json').dependencies.next")
echo "   Next.js version: $NEXT_VERSION"

MAJOR_VERSION=$(echo "$NEXT_VERSION" | grep -oE '[0-9]+' | head -1)
echo "   Major version: $MAJOR_VERSION"

if [ "$MAJOR_VERSION" -lt 16 ]; then
    echo "   ✅ Next.js < 16 detected"
else
    echo "   ⚠️  Warning: Expected Next.js < 16, but got version $NEXT_VERSION"
fi

echo ""
echo "🚀 Running StackPatch CLI..."
echo "   ⚠️  This requires manual interaction - please answer the prompts:"
echo "   1. Choose session mode: Select option 2 (Stateless)"
echo "   2. Enable Email + Password: Select option 1 (Yes)"
echo "   3. Add OAuth providers: Select GitHub and Google (space to select, enter to confirm)"
echo "   4. Add prebuilt auth UI: Select option 1 (Yes)"
echo "   5. Which route should be protected: Enter /dashboard"
echo "   6. Continue: Select option 1 (yes)"
echo ""
echo "   Press Enter when ready to start..."
read

# Run CLI - user will need to interact
node "$CLI_PATH" add auth

echo ""
echo "🔍 Checking generated files..."

# For Next.js < 16, should create proxy.ts (not middleware.ts)
if [ -f "proxy.ts" ]; then
    echo -e "   ${GREEN}✅ PASSED: proxy.ts exists${NC}"

    # Check export syntax
    if grep -q "export default async function handler" proxy.ts; then
        echo -e "   ${GREEN}✅ PASSED: proxy.ts has correct default export${NC}"
    else
        echo -e "   ${RED}❌ FAILED: proxy.ts does not have default export${NC}"
    fi

    if [ -f "middleware.ts" ]; then
        echo -e "   ${RED}❌ FAILED: middleware.ts should NOT exist for Next.js < 16${NC}"
    else
        echo -e "   ${GREEN}✅ PASSED: middleware.ts correctly does not exist${NC}"
    fi
else
    echo -e "   ${RED}❌ FAILED: proxy.ts does not exist${NC}"
    if [ -f "middleware.ts" ]; then
        echo -e "   ${RED}❌ FAILED: middleware.ts exists (should be proxy.ts for Next.js < 16)${NC}"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Next.js 16+ test: Check results above (should have middleware.ts)"
echo "✅ Next.js 15 test: Check results above (should have proxy.ts)"
echo ""
echo "💡 To manually verify:"
echo "   1. Check middleware.ts content in: $NEXT16_DIR (Next.js 16+)"
echo "   2. Check proxy.ts content in: $NEXT15_DIR (Next.js 15)"
echo ""
echo "🧹 Cleanup (optional):"
echo "   rm -rf $NEXT16_DIR $NEXT15_DIR"
