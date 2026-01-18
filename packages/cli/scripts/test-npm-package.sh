#!/bin/bash
# Quick test script to test StackPatch CLI as npm package

set -e

TEST_DIR="/Users/darshitshukla/Desktop/test-stackpatch"
PACKAGE_NAME="stackpatch@latest"

echo "🧪 Testing StackPatch CLI as npm package"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test 1: Next.js 16+
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 1: Next.js 16+ (should create middleware.ts)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

NEXT16_DIR="$TEST_DIR/test-next16-npm"

if [ -d "$NEXT16_DIR" ]; then
    echo "⚠️  Cleaning up existing test directory..."
    rm -rf "$NEXT16_DIR"
fi

echo "📦 Creating Next.js 16+ project..."
npx create-next-app@latest "$NEXT16_DIR" --typescript --app --no-tailwind --no-git --yes

cd "$NEXT16_DIR"

echo ""
echo "📝 Verifying Next.js version..."
NEXT_VERSION=$(node -p "require('./package.json').dependencies.next")
MAJOR_VERSION=$(echo "$NEXT_VERSION" | grep -oE '[0-9]+' | head -1)
echo "   Next.js version: $NEXT_VERSION (Major: $MAJOR_VERSION)"

echo ""
echo "🚀 Running StackPatch CLI from npm..."
echo "   Package: $PACKAGE_NAME"
echo "   ⚠️  You'll need to answer the prompts manually:"
echo "   1. Session mode: 2 (Stateless)"
echo "   2. Email/Password: 1 (Yes)"
echo "   3. OAuth: Select GitHub and Google"
echo "   4. UI: 1 (Yes)"
echo "   5. Protected route: /dashboard"
echo "   6. Continue: 1 (yes)"
echo ""
read -p "Press Enter to start..."

npx "$PACKAGE_NAME" add auth

echo ""
echo "🔍 Verifying results..."

if [ -f "middleware.ts" ]; then
    echo -e "   ${GREEN}✅ PASSED: middleware.ts exists${NC}"
    if grep -q "export async function middleware" middleware.ts; then
        echo -e "   ${GREEN}✅ PASSED: Correct export syntax${NC}"
    else
        echo -e "   ${RED}❌ FAILED: Wrong export syntax${NC}"
    fi
    if [ ! -f "proxy.ts" ]; then
        echo -e "   ${GREEN}✅ PASSED: proxy.ts correctly does not exist${NC}"
    else
        echo -e "   ${RED}❌ FAILED: proxy.ts should not exist${NC}"
    fi
else
    echo -e "   ${RED}❌ FAILED: middleware.ts does not exist${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 2: Next.js 15 (should create proxy.ts)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

NEXT15_DIR="$TEST_DIR/test-next15-npm"

if [ -d "$NEXT15_DIR" ]; then
    echo "⚠️  Cleaning up existing test directory..."
    rm -rf "$NEXT15_DIR"
fi

echo "📦 Creating Next.js 15 project..."
npx create-next-app@15 "$NEXT15_DIR" --typescript --app --no-tailwind --no-git --yes

cd "$NEXT15_DIR"

echo ""
echo "📝 Verifying Next.js version..."
NEXT_VERSION=$(node -p "require('./package.json').dependencies.next")
MAJOR_VERSION=$(echo "$NEXT_VERSION" | grep -oE '[0-9]+' | head -1)
echo "   Next.js version: $NEXT_VERSION (Major: $MAJOR_VERSION)"

echo ""
echo "🚀 Running StackPatch CLI from npm..."
echo "   Package: $PACKAGE_NAME"
echo "   ⚠️  You'll need to answer the prompts manually:"
echo "   1. Session mode: 2 (Stateless)"
echo "   2. Email/Password: 1 (Yes)"
echo "   3. OAuth: Select GitHub and Google"
echo "   4. UI: 1 (Yes)"
echo "   5. Protected route: /dashboard"
echo "   6. Continue: 1 (yes)"
echo ""
read -p "Press Enter to start..."

npx "$PACKAGE_NAME" add auth

echo ""
echo "🔍 Verifying results..."

if [ -f "proxy.ts" ]; then
    echo -e "   ${GREEN}✅ PASSED: proxy.ts exists${NC}"
    if grep -q "export default async function handler" proxy.ts; then
        echo -e "   ${GREEN}✅ PASSED: Correct export syntax${NC}"
    else
        echo -e "   ${RED}❌ FAILED: Wrong export syntax${NC}"
    fi
    if [ ! -f "middleware.ts" ]; then
        echo -e "   ${GREEN}✅ PASSED: middleware.ts correctly does not exist${NC}"
    else
        echo -e "   ${RED}❌ FAILED: middleware.ts should not exist${NC}"
    fi
else
    echo -e "   ${RED}❌ FAILED: proxy.ts does not exist${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Next.js 16+ test: Check results above"
echo "✅ Next.js 15 test: Check results above"
echo ""
echo "🧹 Cleanup (optional):"
echo "   rm -rf $NEXT16_DIR $NEXT15_DIR"
