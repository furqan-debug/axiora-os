# Axiora OS

![Axiora Logo](file:///C:/Users/Mustafa-PC/.gemini/antigravity/brain/3cc5499d-4e93-42a3-97e9-8921078bd08c/axiora_logo_1780785863925.png)

## Overview
Axiora OS is a premium, lightweight desktop experience built on top of Ubuntu 22.04 LTS, Wayland, and GNOME with a custom shell. The goal is to deliver a fast, beautiful, and productive environment that can be installed via a simple ISO.

## Repository Structure
- `docs/` – Design system, architecture diagrams, developer documentation.
- `infra/` – Ubuntu provisioning scripts, ISO build pipeline, branding assets.
- `shell/` – TypeScript source for the custom Axiora Shell UI (Dock, Launcher, Notification Center, Quick Settings).
- `services/` – Rust crates for system utilities (focus‑mode daemon, workspace profiles, etc.).
- `installer/` – Preseed files, branding assets, ISO customization scripts.
- `themes/` – GNOME theme files implementing frosted‑glass and accent colors.
- `packaging/` – Debian packaging metadata for custom .deb packages.
- `ci/` – CI pipelines (GitHub Actions) for automated builds and tests.
- `website/` – Landing page and documentation site.

## Getting Started
```bash
# Clone the repo
git clone https://github.com/yourorg/axiora-os.git
cd axiora-os

# Run the Ubuntu provisioning script (requires Docker)
./infra/setup_ubuntu.sh
```

## Contributing
Please read `CONTRIBUTING.md` for guidelines on how to contribute code, report bugs, and propose new features.

## License
Axiora OS is released under the MIT License.


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
