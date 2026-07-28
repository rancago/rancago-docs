# Contributing to Rancago Docs

Thanks for your interest in contributing to **Rancago Docs**. Contributions are welcome via issues and pull requests.

## Quick Rules

- Keep changes focused and small when possible.
- Prefer clear writing and accurate code examples.
- Keep the design language consistent across pages (components, spacing, typography).
- Do not commit secrets (keys, tokens, credentials). Use env vars and `.env.example` patterns instead.

## Development Setup

```bash
git clone https://github.com/rancago/rancago-docs.git
cd rancago-docs
bun install
bun run dev
```

## Suggested Workflow

1. Create a branch from `main`
2. Make your changes
3. Run lint/build
4. Open a pull request

## Checks

```bash
bun run lint
bun run build
```

## Pull Request Checklist

- Docs build passes locally
- Copywriting is consistent (terminology, capitalization)
- No large assets or generated artifacts committed
