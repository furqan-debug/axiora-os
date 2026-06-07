#!/bin/bash
# install-plymouth-theme.sh — Install Axiora OS Plymouth boot splash
set -e

THEME_DIR="/usr/share/plymouth/themes/axiora"
sudo mkdir -p "$THEME_DIR"

SCRIPT_DIR="$(cd "$(dirname "$0")/plymouth" && pwd)"

sudo cp "$SCRIPT_DIR/axiora.plymouth" "$THEME_DIR/"
sudo cp "$SCRIPT_DIR/axiora.script"   "$THEME_DIR/"

# Copy branding assets
BRANDING_DIR="$(cd "$(dirname "$0")/../infra/branding" && pwd)"
sudo cp "$BRANDING_DIR/logo.png"      "$THEME_DIR/axiora-logo.png"

# Create a simple white dot image (used for the pulsing indicators)
# We use ImageMagick to generate it if available
if command -v convert &>/dev/null; then
    convert -size 8x8 xc:none -fill white -draw "circle 4,4 4,0" \
        "$THEME_DIR/dot.png" 2>/dev/null || true
fi

# Set as default Plymouth theme
sudo update-alternatives --install \
    /usr/share/plymouth/themes/default.plymouth \
    default.plymouth \
    "$THEME_DIR/axiora.plymouth" \
    100

sudo update-initramfs -u
echo "✓ Axiora Plymouth theme installed and set as default."
