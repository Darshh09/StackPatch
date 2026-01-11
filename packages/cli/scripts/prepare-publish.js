#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Copy boilerplate to cli package for publishing
const sourceBoilerplate = path.resolve(__dirname, "../../boilerplate");
const targetBoilerplate = path.resolve(__dirname, "../boilerplate");

if (fs.existsSync(sourceBoilerplate)) {
  // Remove old boilerplate if exists
  if (fs.existsSync(targetBoilerplate)) {
    fs.rmSync(targetBoilerplate, { recursive: true, force: true });
  }

  // Copy boilerplate
  fs.cpSync(sourceBoilerplate, targetBoilerplate, { recursive: true });
  console.log("✅ Boilerplate copied for publishing");
} else {
  console.error("❌ Source boilerplate not found");
  process.exit(1);
}
