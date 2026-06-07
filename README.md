# Axiora OS

A modern, premium‑looking desktop OS built on Ubuntu LTS, Wayland, and GNOME with a custom Axiora Shell.

## Quick Start

1. Clone this repository.
2. Run the CI pipeline or use the provided ISO builder to generate a bootable installer.
3. Install on a machine and enjoy a fast, beautiful desktop experience.

## Repository Layout

- `infra/` – Ubuntu base provisioning, ISO creation scripts, branding assets.
- `shell/` – TypeScript source for the custom Axiora Shell (Dock, Launcher, Notification Center, Quick Settings).
- `services/` – Rust daemons providing background functionality (dock manager, notification service, focus mode, workspace profiles).
- `themes/` – GNOME theme files implementing the frosted‑glass design language.
- `installer/` – Preseed configuration and ISO customization.
- `docs/` – Design system, architecture diagrams, developer guide.
- `packaging/` – Debian packaging metadata for custom utilities.
- `ci/` – GitHub Actions workflows for building, testing, and releasing the ISO.

## Contributing

Please read the `CONTRIBUTING.md` (to be added) for guidelines on code style, commit messages, and testing.

---

© 2026 Axiora OS – All rights reserved.
