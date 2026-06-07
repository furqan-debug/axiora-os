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

echo "Provisioning complete. You are ready to build Axiora OS."
