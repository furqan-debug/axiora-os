#!/bin/bash
# setup_ubuntu.sh - Provision a clean Ubuntu LTS VM for Axiora OS build environment
# This script is meant to be run on an Ubuntu 22.04 LTS base system.

set -e

echo "Starting Axiora OS Ubuntu provisioning..."

# Update package lists
sudo apt-get update
sudo apt-get upgrade -y

# Install core desktop environment (Ubuntu Desktop base with GNOME and Wayland)
echo "Installing base desktop packages..."
sudo apt-get install -y ubuntu-desktop-minimal wayland-protocols \
    gnome-shell gnome-control-center gnome-tweaks

# Install build tools and dependencies
echo "Installing build tools..."
sudo apt-get install -y build-essential curl wget git pkg-config libssl-dev \
    libgtk-3-dev libglib2.0-dev

# Install Cubic for ISO generation
echo "Installing Cubic..."
sudo apt-add-repository -y ppa:cubic-wizard/release
sudo apt-get update
sudo apt-get install -y cubic

# Install Node.js for TypeScript shell development
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Rust for backend services
echo "Installing Rust..."
if ! command -v rustup &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
else
    echo "Rust is already installed."
fi

# Set Wayland as default in GDM3
echo "Enabling Wayland..."
sudo sed -i 's/^#WaylandEnable=false/WaylandEnable=true/' /etc/gdm3/custom.conf || true

# Install Tauri system dependencies
echo "Installing Tauri build dependencies..."
sudo apt-get install -y libwebkit2gtk-4.0-dev libayatana-appindicator3-dev librsvg2-dev \
    libsoup2.4-dev libjavascriptcoregtk-4.0-dev

# Install GLib/DBus dev packages needed by zbus
echo "Installing DBus development libraries..."
sudo apt-get install -y libdbus-1-dev pkg-config

# Build Rust daemons
echo "Building Axiora OS daemons..."
AXIORA_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$AXIORA_DIR/services"
cargo build --release

# Install daemon binaries to /usr/lib/axiora/
echo "Installing daemon binaries..."
sudo mkdir -p /usr/lib/axiora
sudo cp target/release/dock_daemon /usr/lib/axiora/dock-daemon
sudo cp target/release/notification_daemon /usr/lib/axiora/notification-daemon
sudo cp target/release/focus_mode /usr/lib/axiora/focus-mode-daemon

# Install systemd user services
echo "Installing systemd user services..."
mkdir -p "$HOME/.config/systemd/user"
cp "$AXIORA_DIR/infra/systemd/"*.service "$HOME/.config/systemd/user/"
systemctl --user daemon-reload
systemctl --user enable axiora-notification-daemon.service
systemctl --user enable axiora-dock-daemon.service
systemctl --user enable axiora-focus-mode.service

# Install GSettings schema
echo "Installing GSettings schema..."
sudo cp "$AXIORA_DIR/settings/schemas/com.axiora.shell.gschema.xml" \
    /usr/share/glib-2.0/schemas/
sudo glib-compile-schemas /usr/share/glib-2.0/schemas/

# Install GNOME Shell extension
echo "Installing Axiora GNOME Shell extension..."
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/axiora-shell@axiora.os"
mkdir -p "$EXTENSION_DIR/schemas"
cp "$AXIORA_DIR/settings/extension.js" "$EXTENSION_DIR/"
cp "$AXIORA_DIR/settings/prefs.js" "$EXTENSION_DIR/"
cp "$AXIORA_DIR/settings/metadata.json" "$EXTENSION_DIR/"
cp "$AXIORA_DIR/settings/schemas/com.axiora.shell.gschema.xml" "$EXTENSION_DIR/schemas/"
glib-compile-schemas "$EXTENSION_DIR/schemas/"

echo ""
echo "✓ Axiora OS provisioning complete!"
echo "✓ Daemons installed to /usr/lib/axiora/"
echo "✓ Systemd user services enabled."
echo "✓ GNOME extension installed. Run 'gnome-extensions enable axiora-shell@axiora.os' to activate."
echo ""
