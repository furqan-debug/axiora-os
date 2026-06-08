#!/bin/bash
# cubic-customise.sh
# ──────────────────────────────────────────────────────────────────────────────
# This script runs INSIDE the Cubic chroot (equivalent to a live-system chroot).
# Cubic mounts the squashfs, you paste this script into the Cubic terminal, and
# it configures the entire Axiora OS layer on top of Ubuntu 22.04 LTS.
#
# Usage (in Cubic terminal):
#   bash /tmp/cubic-customise.sh
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail

AXIORA_VERSION="0.1.0-dev"
AXIORA_CODENAME="Vega"

echo "════════════════════════════════════════════════════"
echo "  Axiora OS ${AXIORA_VERSION} \"${AXIORA_CODENAME}\" — Chroot Customisation"
echo "════════════════════════════════════════════════════"

# ── 0. Enable full apt sources & update ──────────────────────────────────────
# Add universe, restricted and multiverse repos so all packages are available
add-apt-repository -y universe 2>/dev/null || true
add-apt-repository -y restricted 2>/dev/null || true
add-apt-repository -y multiverse 2>/dev/null || true
apt-get update -qq

# ── 1. Install runtime dependencies ──────────────────────────────────────────
echo "[1/8] Installing runtime dependencies..."
# Install in separate groups so one missing package does not abort everything
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --ignore-missing \
    gnome-shell \
    gnome-session \
    gnome-control-center \
    nautilus \
    gedit \
    gnome-terminal \
    gnome-calculator \
    eog \
    evince \
    network-manager \
    network-manager-gnome \
    pulseaudio || true

DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --ignore-missing \
    gnome-tweaks \
    pavucontrol \
    gir1.2-webkit2-4.0 \
    libayatana-appindicator3-1 \
    librsvg2-2 \
    libdbus-1-3 \
    libglib2.0-0 || true

DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --ignore-missing \
    flatpak \
    plymouth || true

# grub-efi only on EFI systems — skip if not available
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --ignore-missing \
    grub-efi-amd64 \
    grub-pc-bin || true

# Ubiquity installer (may already be present in desktop ISO)
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --ignore-missing \
    ubiquity \
    ubiquity-frontend-gtk \
    ubiquity-slideshow-ubuntu || true

# ── 2. Remove Ubuntu bloat ────────────────────────────────────────────────────
echo "[2/8] Removing unwanted packages..."
DEBIAN_FRONTEND=noninteractive apt-get remove -y -qq \
    ubuntu-session \
    ubuntu-desktop \
    ubuntu-desktop-minimal \
    ubuntu-web-launchers \
    aisleriot \
    gnome-mahjongg \
    gnome-mines \
    gnome-sudoku \
    libreoffice* \
    thunderbird \
    rhythmbox \
    totem \
    cheese || true
apt-get autoremove -y -qq

# ── 3. Install Axiora shell services (.deb) ───────────────────────────────────
echo "[3/8] Installing Axiora OS shell services..."
if [ -f /tmp/axiora-shell-services_${AXIORA_VERSION}_amd64.deb ]; then
    dpkg -i /tmp/axiora-shell-services_${AXIORA_VERSION}_amd64.deb || apt-get install -f -y
else
    echo "  ⚠ .deb not found at /tmp – skipping (CI will copy it before this script runs)"
fi

# ── 4. Install GNOME extension & GSettings schema ─────────────────────────────
echo "[4/8] Registering Axiora GNOME extension..."
EXTENSION_DEST="/usr/share/gnome-shell/extensions/axiora-shell@axiora.os"
mkdir -p "${EXTENSION_DEST}/schemas"

# Files are expected to be staged at /tmp/axiora-extension/
if [ -d /tmp/axiora-extension ]; then
    cp -r /tmp/axiora-extension/* "${EXTENSION_DEST}/"
fi

# Compile schemas system-wide
if [ -f "${EXTENSION_DEST}/schemas/com.axiora.shell.gschema.xml" ]; then
    cp "${EXTENSION_DEST}/schemas/com.axiora.shell.gschema.xml" \
        /usr/share/glib-2.0/schemas/
fi
glib-compile-schemas /usr/share/glib-2.0/schemas/

# Enable extension for all new users via dconf profile
mkdir -p /etc/dconf/profile
cat > /etc/dconf/profile/user <<'DCONF'
user-db:user
system-db:axiora
DCONF

mkdir -p /etc/dconf/db/axiora.d
cat > /etc/dconf/db/axiora.d/00-axiora-defaults <<'DCONF'
[org/gnome/shell]
enabled-extensions=['axiora-shell@axiora.os']
favorite-apps=['org.gnome.Nautilus.desktop', 'org.gnome.Terminal.desktop', 'org.gnome.gedit.desktop', 'org.gnome.Settings.desktop']

[org/gnome/desktop/interface]
color-scheme='prefer-dark'
gtk-theme='Adwaita-dark'
icon-theme='Papirus-Dark'
font-name='Inter 11'
document-font-name='Inter 11'
monospace-font-name='JetBrains Mono 11'

[com/axiora/shell]
accent-color='axiora-blue'
focus-mode-on-startup=false
dock-autohide=false
DCONF

dconf update

# ── 5. Install fonts ──────────────────────────────────────────────────────────
echo "[5/8] Installing Axiora fonts..."
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
    fonts-inter \
    fonts-jetbrains-mono \
    papirus-icon-theme || true

# Fallback: download Inter if package not found
if ! dpkg -s fonts-inter &>/dev/null 2>&1; then
    mkdir -p /usr/share/fonts/truetype/inter
    curl -fsSL "https://github.com/rsms/inter/releases/download/v4.0/Inter-4.0.zip" \
        -o /tmp/inter.zip
    unzip -q /tmp/inter.zip -d /tmp/inter
    cp /tmp/inter/InterVariable.ttf /usr/share/fonts/truetype/inter/
    fc-cache -f
fi

# ── 6. OS identity ────────────────────────────────────────────────────────────
echo "[6/8] Setting OS identity..."

cat > /etc/os-release <<'OSRELEASE'
NAME="Axiora OS"
VERSION="0.1.0 (Vega)"
ID=axiora
ID_LIKE=ubuntu
PRETTY_NAME="Axiora OS 0.1.0 (Vega)"
VERSION_ID="0.1"
HOME_URL="https://axiora.os"
SUPPORT_URL="https://axiora.os/support"
BUG_REPORT_URL="https://github.com/axiora-os/axiora/issues"
LOGO=axiora-logo
OSRELEASE

cat > /etc/axiora-release <<'AXRELEASE'
Axiora OS 0.1.0 "Vega"
Built on Ubuntu 22.04 LTS
AXRELEASE

# Replace the /etc/issue login prompt
cat > /etc/issue <<'ISSUE'

Axiora OS 0.1.0 "Vega" \n \l

ISSUE

# ── 7. Wallpaper & GDM branding ───────────────────────────────────────────────
echo "[7/8] Applying Axiora branding..."

# Copy Axiora wallpaper (expected at /tmp/axiora-branding/)
if [ -d /tmp/axiora-branding ]; then
    mkdir -p /usr/share/backgrounds/axiora
    cp /tmp/axiora-branding/wallpaper.png /usr/share/backgrounds/axiora/axiora-default.png
    cp /tmp/axiora-branding/logo.png      /usr/share/pixmaps/axiora-logo.png
fi

# Set default wallpaper via dconf
cat >> /etc/dconf/db/axiora.d/00-axiora-defaults <<'DCONF'

[org/gnome/desktop/background]
picture-uri='file:///usr/share/backgrounds/axiora/axiora-default.png'
picture-uri-dark='file:///usr/share/backgrounds/axiora/axiora-default.png'
picture-options='zoom'
DCONF
dconf update

# GDM custom CSS for login screen accent
mkdir -p /usr/share/gnome-shell/theme
cat > /usr/share/gnome-shell/theme/axiora-gdm.css <<'CSS'
/* Axiora GDM Login Screen */
#lockDialogGroup {
    background: #0A0A0F url(file:///usr/share/backgrounds/axiora/axiora-default.png) no-repeat center;
    background-size: cover;
}
.login-dialog {
    background: rgba(20, 20, 30, 0.6);
    backdrop-filter: blur(24px);
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.1);
}
CSS

# ── 8. Systemd & Flatpak setup ────────────────────────────────────────────────
echo "[8/8] Final system configuration..."

# Add Flathub for app installation
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo || true

# Disable Ubuntu Pro nagware
pro config set apt_news=false 2>/dev/null || true

# Remove snap store, replace with gnome-software
snap remove --purge snap-store 2>/dev/null || true

# Enable systemd services installed by the .deb
systemctl --global enable axiora-notification-daemon.service 2>/dev/null || true
systemctl --global enable axiora-dock-daemon.service 2>/dev/null || true
systemctl --global enable axiora-focus-mode.service 2>/dev/null || true

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════════"
echo "  ✓ Axiora OS chroot customisation complete!"
echo "  Now: exit Cubic, select your kernel, generate ISO."
echo "════════════════════════════════════════════════════"
