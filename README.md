# 🚀 Rancago Framework — Official Ecosystem Portal & Documentation

[![Go Version](https://img.shields.io/badge/Go-1.21%2B-00ADD8?style=flat&logo=go)](https://go.dev)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-darkgreen.svg)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
[![Aksara Sunda](https://img.shields.io/badge/Culture-%E1%AE%9B%E1%AE%94%E1%AE%AA%E1%AE%9E%E1%AE%8D%E1%AE%B0-8C4A27.svg)](#cultural-philosophy)

> **Rancago** (`ᮛᮔ᮪ᮎᮌ᮰`) is an enterprise-grade, high-performance Go framework engineered around **Clean Architecture**, **Router Agnosticism** (Fiber, Gin, Chi, net/http), and **Built-in System Resiliency** (Circuit Breaker, Rate Limiter, Exponential Backoff).

---

## 📖 Table of Contents

- [Overview & Cultural Philosophy](#overview--cultural-philosophy)
- [3 Core Architectural Pillars](#3-core-architectural-pillars)
- [JSON Data Architecture](#json-data-architecture)
- [Web Portal Features](#web-portal-features)
- [Directory Structure](#directory-structure)
- [Installation & Local Setup](#installation--local-setup)
- [Official Repositories](#official-repositories)
- [License & Community](#license--community)

---

## 🏛️ Overview & Cultural Philosophy

The name **Rancago** originates from the Sundanese word *"Rancagé"*, representing **dexterity, adaptability, innovation, and inventive craftsmanship**. Rooted in the Sundanese wisdom ethos:

> *"Silih Asah, Silih Asih, Silih Asuh"*  
> *(Sharpening minds together, caring for each other, and nurturing growth)*

Rancago brings this cultural philosophy into software engineering: clean, highly resilient, and self-documenting code built for enterprise backend microservices.

---

## 🛡️ 3 Core Architectural Pillars

1. **🛡️ Built-in Resiliency (Circuit Breaker & Retry Engine)**
   - Protects microservice dependencies from cascading failures with configurable sliding-window Circuit Breakers, Rate Limiters, and Exponential Backoff.
2. **⚡ Framework-Agnostic HTTP Adapters**
   - Switch between **Fiber** (FastHTTP), **Gin** (HttpRouter), **Chi** (stdlib net/http), or standard `net/http` drivers by changing **1 line of config** without modifying business logic.
3. **🏛️ Native Clean Architecture**
   - Enforces strict 4-layer separation of concerns (**Domain**, **Usecase**, **Repository**, **Delivery**) with zero-reflection, lightning-fast Dependency Injection.

---

## 🗄️ JSON Data Architecture

All portal documentation, repository metrics, community links, and navigation structures are decoupled into modular, human-readable **JSON files** in `/src/data/`. This enables effortless content updates without modifying React component logic or risking layout regressions.

```
src/data/
├── docsContent.json     # All documentation sections, code snippets, diagrams, and bilingual content
├── githubData.json      # Official repository metadata, fallback stats, and contributor profiles
└── navigation.json      # Brand titles, Sundanese script, quick links, and navigation tab items
```

### Benefits of JSON-Driven Content:
- **Zero Component Editing**: Add new documentation items or code samples by simply updating `docsContent.json`.
- **Bilingual Schema**: Each document item supports dual language keys (`id` for Indonesian, `en` for English).
- **Type Safety**: Evaluated directly against TypeScript interfaces (`DocSection`, `RepoStats`, `Contributor`).

---

## ⚡ Web Portal Features

- **📌 Fixed Non-Scrolling Navigation Bar**:
  - **Desktop View**: Top header glued to viewport (`fixed top-0`) with search bar, language switcher, and theme toggle.
  - **Mobile View**: Fixed bottom navigation bar (`fixed bottom-0`) for touch ergonomics with slide-up menu drawer.
- **🌐 Real-time GitHub API Integration**:
  - Live contributor stats fetched dynamically across official `rancago` repositories with automatic fallback resilience.
- **🖥️ Interactive CLI Playground**:
  - Live terminal emulator simulating `rancago new`, `rancago generate module`, and `rancago dev` commands with colorful output.
- **🔍 Global Search Modal**:
  - Search documentation content instantly with keyboard shortcut (`⌘K` or `Ctrl+K`) and matching term highlighting.
- **🌗 Dark / Light Mode with Keyboard Shortcut**:
  - Warm neutral theme palette paired with `T` key shortcut to switch modes effortlessly.
- **🎨 Sundanese Cultural Accents**:
  - Distinctive Sundanese Aksara (`ᮛᮔ᮪ᮎᮌ᮰`) badges and batik geometric background patterns.

---

## 📂 Directory Structure

```
rancago-docs/
├── public/                  # Static assets and favicon
├── src/
│   ├── components/          # Modular React components
│   │   ├── CliPlayground.tsx       # Terminal emulator component
│   │   ├── ContributorsSection.tsx # Realtime GitHub contributor list
│   │   ├── DocViewer.tsx           # Documentation reader with Mermaid diagrams & code copy
│   │   ├── Footer.tsx              # Ecosystem footer
│   │   ├── Navbar.tsx              # Fixed responsive desktop/mobile navbar
│   │   ├── ReposSection.tsx        # Official repository showcase
│   │   ├── SearchModal.tsx         # Full-text search modal dialog
│   │   └── SundanesePattern.tsx    # Aksara Sunda cultural badges
│   ├── data/                # Decoupled JSON data files
│   │   ├── docsContent.json        # Documentation articles & guides
│   │   ├── githubData.json         # Repositories & fallback stats
│   │   └── navigation.json         # Branding & navbar configuration
│   ├── services/            # API services (GitHub REST API integration)
│   ├── types.ts             # Global TypeScript type definitions
│   ├── App.tsx              # Primary application orchestrator
│   └── main.tsx             # React entrypoint
├── README.md                # English ecosystem documentation
└── package.json             # Dependencies and scripts
```

---

## 🛠️ Installation & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **bun**

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rancago/rancago-docs.git
   cd rancago-docs
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Start the development server**:
   ```bash
   bun run dev
   ```
   Open your browser at `http://localhost:3000`.

4. **Verify TypeScript & Linting**:
   ```bash
   bun run lint
   ```

5. **Build for production**:
   ```bash
   bun run build
   ```

---

## 📦 Official Repositories

| Repository | Description | Status / Version |
| :--- | :--- | :--- |
| [**rancago/rancago**](https://github.com/rancago/rancago) | Core framework kernel with Clean Architecture & Resiliency | `v1.8.2` |
| [**rancago/rancago-cli**](https://github.com/rancago/rancago-cli) | CLI code generator & live reload dev server tool | `v2.1.0` |
| [**rancago/rancago-install**](https://github.com/rancago/rancago-install) | Cross-platform zero-dependency shell installer script | `v1.4.0` |
| [**rancago/forums**](https://github.com/rancago/forums) | Community Q&A hub and technical discussions | `GitHub Discussions` |

---

## 🤝 Community & License

- **License**: Released under the [MIT License](LICENSE).
- **Community Forum**: Join discussions, ask architecture questions, or report issues at [rancago/forums/discussions](https://github.com/rancago/forums/discussions).

*Built with passion for clean code, high resiliency, and Sundanese cultural elegance (`ᮛᮔ᮪ᮎᮌ᮰`).*
