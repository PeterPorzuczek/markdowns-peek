# MarkdownsPeek

[![Tests](https://github.com/your-username/markdowns-peek/actions/workflows/test.yml/badge.svg)](https://github.com/your-username/markdowns-peek/actions/workflows/test.yml)
[![Deploy](https://github.com/your-username/markdowns-peek/actions/workflows/deploy.yml/badge.svg)](https://github.com/your-username/markdowns-peek/actions/workflows/deploy.yml)

A beautiful GitHub Markdown file viewer for web applications.

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

This project uses GitHub Actions for continuous integration and deployment:

### Workflows

- **Tests** (`test.yml`) - Runs tests on multiple Node.js versions (16.x, 18.x, 20.x)
- **Deploy** (`deploy.yml`) - Automatically deploys to GitHub Pages on push to main
- **Lint** (`lint.yml`) - Checks code formatting and build process

### Triggers

- Tests and Lint run on every push to `main` and pull requests
- Deploy runs only on push to `main` branch

### Status Badges

The README includes badges showing the status of Tests and Deploy workflows.

## License

LGPL-2.1