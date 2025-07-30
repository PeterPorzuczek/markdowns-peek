# MarkdownsPeek

[![Tests](https://github.com/peterporzuczek/markdowns-peek/actions/workflows/test.yml/badge.svg)](https://github.com/peterporzuczek/markdowns-peek/actions/workflows/test.yml)
[![Star on GitHub](https://img.shields.io/github/stars/PeterPorzuczek/markdowns-peek?style=social)](https://github.com/PeterPorzuczek/markdowns-peek)

A beautiful GitHub Markdown file viewer for web applications.

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