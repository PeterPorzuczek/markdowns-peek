# MarkdownsPeek

[![Tests](https://github.com/peterporzuczek/markdowns-peek/actions/workflows/test.yml/badge.svg)](https://github.com/peterporzuczek/markdowns-peek/actions/workflows/test.yml)
[![Star on GitHub](https://img.shields.io/github/stars/PeterPorzuczek/markdowns-peek?style=social)](https://github.com/PeterPorzuczek/markdowns-peek)

A beautiful GitHub Markdown file viewer for web applications.

## Description

MarkdownsPeek is a headless content provider that fetches Markdown files directly from GitHub repositories at runtime and renders them in your application. Instead of bundling static content or coupling copy updates to deploys, it decouples content from code so product teams can ship UI changes independently from editorial workflows.

Key characteristics of the headless approach:

- Content lives in GitHub: writers and developers collaborate via branches, reviews, and versioning without a custom CMS.
- Runtime delivery: the widget retrieves a directory listing and individual Markdown files from the GitHub API on demand.
- Client-rendered UI shell: your app provides the hosting surface; MarkdownsPeek handles listing, loading states, sanitization, and display.
- Optional routing: deep links can point to specific articles; the widget can hide the file list to create a fullscreen article experience.
- Progressive enhancement: initial UI mounts instantly; content loads asynchronously with visual feedback.

Why this matters:

- Faster content iteration: update Markdown in GitHub and see it live without redeploying the app.
- Lower operational load: no servers or databases to run for content delivery.
- Strong governance: use pull requests, code owners, and CI for quality and compliance.
- Portable and embeddable: drop the widget into any site or microsite without changing your build pipeline.

How it works at a glance:

1. The widget mounts into a container and injects scoped styles using a unique prefix.
2. It fetches a GitHub directory, filters `.md` files, and renders a selectable list.
3. On selection or deep link, it fetches and sanitizes the Markdown, then renders it with reading-time and optional metadata (date from a header comment).
4. With routing enabled, fullscreen mode can be used to present an article URL suitable for sharing or embedding.

## Preview

### [Live](https://peterporzuczek.github.io/markdowns-peek/)

<div><img src="https://i.imgur.com/fogEBZP.png" width="80%"></div>

---

## Installation

```bash
npm install markdowns-peek
```

## Usage

```javascript
import { MarkdownsPeek } from 'markdowns-peek';

const container = document.getElementById('markdown-viewer');
const viewer = new MarkdownsPeek(container, {
  prefix: 'custom-prefix-',
  owner: "peterporzuczek",
  repo: "articles",
  path: "articles-md",
  disableStyles: false,
  sortAlphabetically: false,
  showGitHubLink: false,
  loadFirstFileAutomatically: false // As of now important to show without routing launched
  texts: {
    menu: 'Menu',
    files: 'Files',
    loading: 'Loading...',
    selectFile: 'Select file to view',
    error: 'Error:',
    noFiles: 'No files found'
  }
});
```

## Testing

This project uses Jest and jest-cucumber for testing. To run the tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- `features/` - Gherkin feature files
- `tests/` - Jest test files with step definitions
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Jest setup for DOM environment

### Running Tests

The tests use jsdom to simulate a browser environment and test the library's functionality without modifying the core logic.

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Development mode with watch
npm run dev

# Serve examples
npm run serve
```

## GitHub Actions

This project uses GitHub Actions for continuous integration:

### Workflows

- **Tests** (`test.yml`) - Runs tests on Node.js 20.x

### Triggers

- Tests and Lint run on every push to `main` and pull requests

### Status Badges

The README includes a badge showing the status of Tests workflow.

## License

LGPL-2.1