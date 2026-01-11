#!/bin/bash
# Check if lockfile is up to date

set -e

echo "🔍 Checking if pnpm-lock.yaml is up to date..."

# Try to install with frozen lockfile
if pnpm install --frozen-lockfile 2>&1 | grep -q "ERR_PNPM_OUTDATED_LOCKFILE"; then
  echo "❌ Lockfile is outdated!"
  echo ""
  echo "To fix this, run:"
  echo "  pnpm install"
  echo ""
  echo "Then commit the updated pnpm-lock.yaml file."
  exit 1
else
  echo "✅ Lockfile is up to date!"
  exit 0
fi
