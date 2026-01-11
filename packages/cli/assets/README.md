# Assets Directory

Place your `logo.png` file here to use it as ASCII art in the CLI welcome screen.

## Requirements

- **File name**: `logo.png`
- **Format**: PNG with transparent background works best
- **Recommended size**: 400-800px wide (will be automatically resized for terminal)
- **Colors**: Full color PNGs will be converted to colored ASCII art

## How it works

The CLI will automatically:
1. Load `logo.png` from this directory
2. Convert it to colored ASCII art
3. Display it in the welcome screen with rainbow colors preserved

If the PNG doesn't exist, it will fall back to a simple text logo.
