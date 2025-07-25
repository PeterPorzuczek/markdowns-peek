# GitHub Markdown Viewer

A beautiful and easy-to-use GitHub Markdown file viewer for web applications. Display markdown files from any GitHub repository with an elegant interface.

## Features

- 📁 Browse markdown files from any GitHub repository
- 🎨 Beautiful UI with light/dark theme support
- 📱 **Mobile responsive design** with touch-friendly navigation
- 🔒 Support for private repositories (with token)
- ⚡ Lightweight and fast
- 🎯 Easy to integrate
- 📊 Reading time estimation for each document
- 📈 Progress indicator while reading
- 🍔 Mobile hamburger menu for seamless navigation

## Installation

```bash
npm install markdowns-peek
```

Or using yarn:

```bash
yarn add markdowns-peek
```

## Usage

### Basic Usage

```html
<!-- Add a container div -->
<div id="markdown-viewer"></div>

<!-- Include the script -->
<script type="module">
  import GitHubMarkdownViewer from 'markdowns-peek';

  const viewer = new GitHubMarkdownViewer({
    containerId: 'markdown-viewer',
    owner: 'facebook',
    repo: 'react',
    path: 'docs'  // optional: specific directory path
  });
</script>
```

### Using CDN

```html
<script src="https://unpkg.com/markdowns-peek/dist/markdowns-peek.min.js"></script>
<script>
  const viewer = new GitHubMarkdownViewer({
    containerId: 'markdown-viewer',
    owner: 'vuejs',
    repo: 'vue',
    path: 'docs'
  });
</script>
```

### Advanced Configuration

```javascript
const viewer = new GitHubMarkdownViewer({
  containerId: 'markdown-viewer',
  owner: 'microsoft',
  repo: 'typescript',
  branch: 'main',              // default: 'main'
  path: 'doc',                 // default: '' (root)
  token: 'your-github-token',  // for private repos
  theme: 'dark',               // 'light' or 'dark', default: 'light'
  disableStyles: false         // set to true to disable default styles
});
```

## API Methods

### setRepository(owner, repo, options)

Change the repository dynamically:

```javascript
viewer.setRepository('nodejs', 'node', {
  branch: 'master',
  path: 'doc/api'
});
```

### refresh()

Reload the current directory:

```javascript
viewer.refresh();
```

### toggleTheme()

Switch between light and dark theme:

```javascript
viewer.toggleTheme();
```

### destroy()

Clean up the viewer:

```javascript
viewer.destroy();
```

## Styling

The viewer comes with default styles, but you can customize it using CSS:

```css
/* Container height */
.gmv-container {
  height: 800px !important;
}

/* Sidebar width (desktop only) */
@media (min-width: 769px) {
  .gmv-files {
    width: 350px !important;
  }
}

/* Custom theme colors */
.gmv-container.dark {
  background: #1a1a1a !important;
}

/* Mobile menu button styling */
.gmv-menu-toggle {
  background: rgba(255, 255, 255, 0.15) !important;
}
```

### Mobile Responsiveness

The viewer is fully responsive and optimized for mobile devices:

- **Tablets (< 768px)**: Side panel becomes a slide-out menu
- **Phones (< 480px)**: Optimized typography and spacing
- **Touch devices**: Larger tap targets for better usability

The mobile menu can be toggled using the hamburger button that appears in the top-left corner on mobile devices.

### Disabling Default Styles

If you want to use your own CSS styles, you can disable the default styles:

```javascript
const viewer = new GitHubMarkdownViewer({
  containerId: 'markdown-viewer',
  owner: 'facebook',
  repo: 'react',
  disableStyles: true  // Disable all default styles
});
```

When `disableStyles` is set to `true`, you'll need to provide your own CSS. The viewer uses the following class structure:

- `.gmv-container` - Main container
- `.gmv-files` - File list sidebar
- `.gmv-content` - Content area
- `.gmv-menu-toggle` - Mobile menu button
- `.gmv-header` - Document header
- `.gmv-body` - Document body
- `.gmv-text` - Markdown content

## Private Repositories

To access private repositories, you need to provide a GitHub personal access token:

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with `repo` scope
3. Use the token in your configuration:

```javascript
const viewer = new GitHubMarkdownViewer({
  containerId: 'markdown-viewer',
  owner: 'your-username',
  repo: 'private-repo',
  token: 'ghp_xxxxxxxxxxxxx'
});
```

## Examples

### React Component

```jsx
import React, { useEffect, useRef } from 'react';
import GitHubMarkdownViewer from 'markdowns-peek';

function MarkdownViewer({ owner, repo }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    const viewer = new GitHubMarkdownViewer({
      containerId: 'md-viewer',
      owner,
      repo
    });

    viewerRef.current = viewer;

    return () => {
      viewer.destroy();
    };
  }, [owner, repo]);

  return <div id="md-viewer" />;
}
```

### Vue Component

```vue
<template>
  <div id="md-viewer"></div>
</template>

<script>
import GitHubMarkdownViewer from 'markdowns-peek';

export default {
  props: ['owner', 'repo'],
  mounted() {
    this.viewer = new GitHubMarkdownViewer({
      containerId: 'md-viewer',
      owner: this.owner,
      repo: this.repo
    });
  },
  beforeUnmount() {
    this.viewer.destroy();
  }
}
</script>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

If you found this project helpful, please give it a ⭐️!

For issues and feature requests, please [create an issue](https://github.com/yourusername/markdowns-peek/issues).