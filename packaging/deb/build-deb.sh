#!/bin/bash
# build-deb.sh — Build the axiora-shell-services .deb package
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DEB_STAGING="$SCRIPT_DIR/axiora-shell-services"
VERSION="0.1.0"

echo "Building Axiora OS services daemons (release)..."
cd "$REPO_ROOT/services"
cargo build --release

# Prepare staging layout
echo "Staging .deb package..."
mkdir -p "$DEB_STAGING/usr/lib/axiora"
mkdir -p "$DEB_STAGING/usr/share/glib-2.0/schemas"
mkdir -p "$DEB_STAGING/usr/share/axiora/extensions/axiora-shell@axiora.os/schemas"
mkdir -p "$DEB_STAGING/usr/lib/systemd/user"

# Copy daemon binaries
cp "$REPO_ROOT/services/target/release/dock_daemon"          "$DEB_STAGING/usr/lib/axiora/dock-daemon"
cp "$REPO_ROOT/services/target/release/notification_daemon"  "$DEB_STAGING/usr/lib/axiora/notification-daemon"
cp "$REPO_ROOT/services/target/release/focus_mode"           "$DEB_STAGING/usr/lib/axiora/focus-mode-daemon"
chmod +x "$DEB_STAGING/usr/lib/axiora/"*

# Copy GSettings schema
cp "$REPO_ROOT/settings/schemas/com.axiora.shell.gschema.xml" \
   "$DEB_STAGING/usr/share/glib-2.0/schemas/"

# Copy GNOME extension
cp "$REPO_ROOT/settings/extension.js"  "$DEB_STAGING/usr/share/axiora/extensions/axiora-shell@axiora.os/"
cp "$REPO_ROOT/settings/prefs.js"      "$DEB_STAGING/usr/share/axiora/extensions/axiora-shell@axiora.os/"
cp "$REPO_ROOT/settings/metadata.json" "$DEB_STAGING/usr/share/axiora/extensions/axiora-shell@axiora.os/"
cp "$REPO_ROOT/settings/schemas/com.axiora.shell.gschema.xml" \
   "$DEB_STAGING/usr/share/axiora/extensions/axiora-shell@axiora.os/schemas/"

# Copy systemd service units
cp "$REPO_ROOT/infra/systemd/"*.service "$DEB_STAGING/usr/lib/systemd/user/"

# Fix postinst permissions
chmod 755 "$DEB_STAGING/DEBIAN/postinst"

# Build the .deb
echo "Building .deb..."
dpkg-deb --build "$DEB_STAGING" "$SCRIPT_DIR/axiora-shell-services_${VERSION}_amd64.deb"

echo ""
echo "✓ Built: $SCRIPT_DIR/axiora-shell-services_${VERSION}_amd64.deb"
