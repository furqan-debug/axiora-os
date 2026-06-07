#!/bin/bash
# install-grub-theme.sh — Install the Axiora OS GRUB bootloader theme
set -e

THEME_DIR="/boot/grub/themes/axiora"
sudo mkdir -p "$THEME_DIR"

# Copy theme assets (font, icons, background)
sudo cp axiora-grub-background.png "$THEME_DIR/background.png"

# Generate a GRUB font from Inter
sudo grub-mkfont -s 24 -o "$THEME_DIR/inter-24.pf2" \
    /usr/share/fonts/truetype/inter/InterVariable.ttf 2>/dev/null || true

# Write theme.txt
sudo tee "$THEME_DIR/theme.txt" > /dev/null <<'THEME'
# Axiora OS GRUB Theme
# ───────────────────────────────────────────────────────
desktop-image: "background.png"
desktop-color: "#0A0A0F"
title-color: "#FAFAFA"
title-font: "Inter Regular 24"

+ boot_menu {
    left = 20%
    top = 30%
    width = 60%
    height = 40%
    item_font = "Inter Regular 16"
    item_color = "#CCCCCC"
    selected_item_color = "#FFFFFF"
    selected_item_pixmap_style = "highlight_*.png"
    item_height = 36
    item_padding = 16
    item_spacing = 4
}

+ label {
    top = 80%
    left = 50%-150
    width = 300
    align = "center"
    id = "__title__"
    text = "Axiora OS 0.1.0 \"Vega\""
    color = "rgba(255, 255, 255, 0.5)"
    font = "Inter Regular 13"
}

+ progress_bar {
    id = "__timeout__"
    left = 50%-200
    top = 87%
    width = 400
    height = 3
    show_text = false
    fg_color = "#007AFF"
    bg_color = "rgba(255, 255, 255, 0.1)"
    border_color = "rgba(0,0,0,0)"
}
THEME

# Update GRUB config
sudo sed -i 's|^GRUB_THEME=.*|GRUB_THEME="/boot/grub/themes/axiora/theme.txt"|' /etc/default/grub
sudo sed -i 's|^#GRUB_THEME=.*|GRUB_THEME="/boot/grub/themes/axiora/theme.txt"|' /etc/default/grub

# Set GRUB timeout and style
sudo sed -i 's/^GRUB_TIMEOUT=.*/GRUB_TIMEOUT=5/' /etc/default/grub
sudo sed -i 's/^GRUB_TIMEOUT_STYLE=.*/GRUB_TIMEOUT_STYLE=menu/' /etc/default/grub
sudo sed -i 's/^GRUB_CMDLINE_LINUX_DEFAULT=.*/GRUB_CMDLINE_LINUX_DEFAULT="quiet splash axiora.loglevel=3"/' /etc/default/grub

# Rebuild GRUB
sudo update-grub

echo "✓ Axiora GRUB theme installed."
