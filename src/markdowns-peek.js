// markdowns-peek.js - Ultra Minimal Edition
import { marked } from 'marked';
import DOMPurify from 'dompurify';

class GitHubMarkdownViewer {
  constructor(options = {}) {
    this.owner = options.owner || '';
    this.repo = options.repo || '';
    this.branch = options.branch || 'main';
    this.path = options.path || '';
    this.token = options.token || null;
    this.containerId = options.containerId || 'markdowns-peek';
    this.theme = options.theme || 'dark';
    this.height = options.height || '600px';
    this.disableStyles = options.disableStyles || false;
    
    this.container = null;
    this.currentFile = null;
    this.files = [];
    
    this.init();
  }

  updateTextWidth() {
    const body = this.container.querySelector('.gmv-body');
    const text = this.container.querySelector('.gmv-text');
    if (!body || !text) return;
    const styles = getComputedStyle(body);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    const width = body.clientWidth - paddingLeft - paddingRight - 10;
    if (width > 0) {
      text.style.width = `${width}px`;
    }
  }

  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error(`Container with id "${this.containerId}" not found`);
      return;
    }
    
    this.injectStyles();
    this.render();
    this.setupMobileMenu();
    this.loadDirectory();
    this.updateTextWidth(); // Wywołanie na starcie
    window.addEventListener('resize', this.updateTextWidth.bind(this)); // Nasłuchiwanie zdarzenia resize
  }
  
  setupMobileMenu() { // <- Przywrócona metoda
    const menuToggle = this.container.querySelector('.gmv-menu-toggle');
    const filesPanel = this.container.querySelector('.gmv-files');
    const overlay = this.container.querySelector('.gmv-files-overlay');
    
    if (menuToggle && filesPanel && overlay) {
      // Toggle menu
      menuToggle.addEventListener('click', () => {
        filesPanel.classList.toggle('active');
        overlay.classList.toggle('active');
        this.updateTextWidth();
      });
      
      // Close menu when clicking overlay
      overlay.addEventListener('click', () => {
        filesPanel.classList.remove('active');
        overlay.classList.remove('active');
        this.updateTextWidth();
      });
      
      // Close menu when selecting a file
      filesPanel.addEventListener('click', (e) => {
        if (e.target.closest('.gmv-file')) {
          // Only close on mobile
          if (window.innerWidth <= 768) {
            setTimeout(() => {
              filesPanel.classList.remove('active');
              overlay.classList.remove('active');
              this.updateTextWidth();
            }, 100);
          }
        }
      });
    }
  }

  formatFileName(filename) {
    return filename
      .replace('.md', '')
      .replace(/-/g, '.')
      .toUpperCase();
  }

  calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  }

  formatFileSize(bytes) {
    const kb = (bytes / 1024).toFixed(0);
    return kb + 'KB';
  }

  injectStyles() {
    // Skip style injection if disableStyles is true
    if (this.disableStyles) return;
    
    if (document.getElementById('markdowns-peek-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'markdowns-peek-styles';
    styles.textContent = `
      .gmv-container {
        display: flex;
        position: relative;
        background: #000;
        color: #fff;
        font-family: -apple-system, system-ui, sans-serif;
        height: 100%;
        overflow: hidden;
      }
      
      .gmv-container * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      /* Ensure nothing overflows the container */
      .gmv-container {
        overflow: hidden;
      }
      
      /* Global overflow prevention for all elements */
      .gmv-text * {
        max-width: 99%;
      }
      
      /* Left Panel */
      .gmv-files {
        width: 240px;
        padding: 40px 30px;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        overflow-y: auto;
        overflow-x: hidden;
        flex-shrink: 0;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
      }
      
      .gmv-files::-webkit-scrollbar {
        display: none;
      }
      
      .gmv-label {
        font-size: 10px;
        letter-spacing: 0.15em;
        color: #666;
        margin-bottom: 30px;
        font-weight: 500;
      }
      
      .gmv-file {
        padding: 15px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        cursor: pointer;
        transition: padding-left 0.15s ease;
        position: relative;
      }
      
      .gmv-file:hover {
        padding-left: 10px;
      }
      
      .gmv-file.active::before {
        content: '';
        position: absolute;
        left: -30px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 4px;
        background: #fff;
      }
      
      .gmv-file-name {
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.03em;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .gmv-file-meta {
        font-size: 10px;
        color: #666;
        letter-spacing: 0.05em;
      }
      
      /* Right Panel */
      .gmv-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background: #000;
        position: relative;
      }
      
      .gmv-header {
        padding: 40px 50px 30px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        box-sizing: border-box;
      }
      
      .gmv-title {
        font-size: 36px;
        font-weight: 700;
        letter-spacing: -0.02em;
        margin-bottom: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        cursor: default;
      }
      
      .gmv-info {
        font-size: 10px;
        color: #666;
        letter-spacing: 0.1em;
      }
      
      .gmv-info span {
        margin-right: 15px;
      }
      
      .gmv-body {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 40px 50px 60px;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        padding-right: 8px; /* Stały padding na desktopie */
      }
      
      .gmv-body::-webkit-scrollbar {
        width: 1px; /* Domyślnie bardzo cienki */
        background: transparent;
        transition: width 0.2s;
      }
      .gmv-body:hover::-webkit-scrollbar {
        width: 8px; /* Na hover staje się szeroki */
      }
      .gmv-body::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 4px;
        opacity: 0; /* Domyślnie niewidoczny */
        pointer-events: none; /* Nieklikalny, gdy niewidoczny */
        transition: opacity 0.2s, background 0.2s;
      }
      .gmv-body:hover::-webkit-scrollbar-thumb {
        opacity: 1; /* Pojawia się na hover */
        pointer-events: auto; /* Staje się klikalny na hover */
        background: #444;
      }
      
      .gmv-text {
        max-width: 900px;
        line-height: 1.6;
        font-size: 15px;
        word-wrap: break-word;
        overflow-wrap: break-word;
        padding: 0;
        margin: 0 auto;
        box-sizing: border-box;
        margin-left: 0;
      }
      
      .gmv-text h1,
      .gmv-text h2,
      .gmv-text h3 {
        font-weight: 700;
        letter-spacing: -0.02em;
        margin: 2.5em 0 1em;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      
      .gmv-text h1:first-child,
      .gmv-text h2:first-child {
        margin-top: 0;
      }
      
      .gmv-text h1 { font-size: 28px; }
      .gmv-text h2 { font-size: 20px; }
      .gmv-text h3 { font-size: 16px; }
      
      .gmv-text p {
        margin-bottom: 1.2em;
        color: rgba(255, 255, 255, 0.8);
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      
      .gmv-text code {
        background: rgba(255, 255, 255, 0.05);
        padding: 2px 4px;
        font-family: 'SF Mono', Consolas, monospace;
        font-size: 0.85em;
        word-break: break-word;
      }
      
      .gmv-text pre {
        background: rgba(255, 255, 255, 0.02);
        border-left: 1px solid rgba(255, 255, 255, 0.1);
        padding: 15px 20px;
        overflow-x: auto;
        margin: 1.5em 0;
        font-size: 13px;
        line-height: 1.4;
        max-width: 100%;
        -webkit-overflow-scrolling: touch;
      }
      
      .gmv-text pre code {
        word-break: normal;
        white-space: pre;
      }
      
      .gmv-text blockquote {
        border-left: 1px solid #333;
        padding-left: 20px;
        margin: 1.5em 0;
        color: #999;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      
      .gmv-text a {
        color: #fff;
        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 2px;
        word-break: break-word;
        overflow-wrap: break-word;
      }
      
      .gmv-text ul,
      .gmv-text ol {
        margin-bottom: 1.2em;
        padding-left: 20px;
        max-width: 100%;
      }
      
      .gmv-text li {
        margin-bottom: 0.3em;
        color: rgba(255, 255, 255, 0.8);
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      
      .gmv-text table {
        width: 100%;
        margin: 1.5em 0;
        font-size: 14px;
        display: block;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      .gmv-text th,
      .gmv-text td {
        padding: 8px 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-align: left;
        word-break: break-word;
        overflow-wrap: break-word;
      }
      
      .gmv-text th {
        background: rgba(255, 255, 255, 0.02);
        font-weight: 600;
        font-size: 12px;
        letter-spacing: 0.03em;
      }
      
      /* Images */
      .gmv-text img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 1.5em 0;
      }
      
      /* Horizontal rule */
      .gmv-text hr {
        border: none;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        margin: 2em 0;
      }
      
      /* Mobile-specific text adjustments */
      @media (max-width: 768px) {
        .gmv-text h4,
        .gmv-text h5,
        .gmv-text h6 {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
      }

      /* Empty State */
      .gmv-empty {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        font-size: 11px;
        letter-spacing: 0.1em;
      }
      
      /* Loading */
      .gmv-loading {
        color: #666;
        font-size: 11px;
        letter-spacing: 0.1em;
        padding: 20px 0;
      }
      
      /* Error */
      .gmv-error {
        color: #666;
        padding: 20px 0;
        font-size: 11px;
        letter-spacing: 0.05em;
      }
      
      /* Progress */
      .gmv-progress {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 1px;
        background: #fff;
        transform-origin: left;
        transform: scaleX(0);
        transition: transform 0.3s ease;
        z-index: 1002;
        pointer-events: none;
      }
      
      /* Light theme */
      .gmv-container.light {
        background: #fff;
        color: #000;
      }
      
      .gmv-container.light .gmv-files,
      .gmv-container.light .gmv-content {
        background: #fff;
      }
      
      .gmv-container.light .gmv-files,
      .gmv-container.light .gmv-header {
        border-color: rgba(0, 0, 0, 0.1);
      }
      
      .gmv-container.light .gmv-file {
        border-color: rgba(0, 0, 0, 0.05);
      }
      
      .gmv-container.light .gmv-file.active::before {
        background: #000;
      }
      
      .gmv-container.light .gmv-label,
      .gmv-container.light .gmv-file-meta,
      .gmv-container.light .gmv-info {
        color: #999;
      }
      
      .gmv-container.light .gmv-text p,
      .gmv-container.light .gmv-text li {
        color: rgba(0, 0, 0, 0.8);
      }
      
      .gmv-container.light .gmv-text code {
        background: rgba(0, 0, 0, 0.05);
      }
      
      .gmv-container.light .gmv-text pre {
        background: rgba(0, 0, 0, 0.02);
        border-color: rgba(0, 0, 0, 0.1);
      }
      
      .gmv-container.light .gmv-text blockquote {
        border-color: #ccc;
        color: #666;
      }
      
      .gmv-container.light .gmv-text a {
        color: #000;
      }
      
      .gmv-container.light .gmv-text th,
      .gmv-container.light .gmv-text td {
        border-color: rgba(0, 0, 0, 0.1);
      }
      
      .gmv-container.light .gmv-text th {
        background: rgba(0, 0, 0, 0.02);
      }
      
      .gmv-container.light .gmv-empty {
        color: #ccc;
      }
      
      .gmv-container.light .gmv-body::-webkit-scrollbar-thumb {
        background: #ccc;
      }
      .gmv-container.light .gmv-body:hover::-webkit-scrollbar-thumb {
        background: #bbb;
      }
      
      .gmv-container.light .gmv-progress {
        background: #000;
      }
      
      /* Mobile Styles - Przywrócone */
      .gmv-menu-toggle {
        display: none; /* Domyślnie ukryty na desktopie */
        position: absolute; /* Pozycjonowany względem .gmv-container */
        top: 20px;
        left: 20px;
        z-index: 101; /* Niżej niż progress bar, wyżej niż content */
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 11px;
        letter-spacing: 0.1em;
        color: #fff;
        transition: all 0.2s ease;
      }
      .gmv-menu-toggle:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      .gmv-container.light .gmv-menu-toggle {
        background: rgba(0, 0, 0, 0.05);
        border-color: rgba(0, 0, 0, 0.1);
        color: #000;
      }
      .gmv-container.light .gmv-menu-toggle:hover {
        background: rgba(0, 0, 0, 0.1);
      }
      .gmv-files-overlay {
        display: none; /* Domyślnie ukryty */
        position: absolute; /* Pozycjonowany względem .gmv-container */
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100; /* Niżej niż menu panel */
      }
      @media (max-width: 768px) {
        .gmv-container {
          flex-direction: column;
        }
        .gmv-menu-toggle {
          display: block; /* Pokazany na mobile */
        }
        .gmv-files {
          position: absolute; /* Wysuwa się */
          top: 0;
          left: -100%;
          width: 280px;
          height: 100%;
          z-index: 100; /* Wyżej niż overlay */
          transition: left 0.3s ease;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
        }
        .gmv-files.active {
          left: 0; /* Wysunięty */
        }
        .gmv-files-overlay.active {
          display: block; /* Widoczny, gdy menu aktywne */
        }
        .gmv-content {
          width: 100%;
          padding-top: 60px; /* Miejsce na przycisk menu */
        }
        .gmv-header {
          padding: 30px 20px 20px;
        }
        .gmv-title {
          font-size: 28px;
          white-space: normal; /* Zawija tekst */
          word-wrap: break-word;
        }
        .gmv-body {
          padding: 30px 20px 40px 20px;
          padding-right: calc(20px + 8px); /* Padding + miejsce na scrollbar */
        }
        .gmv-text {
          font-size: 14px;
          padding: 0 10px;
        }
        .gmv-text h1 { font-size: 24px; }
        .gmv-text h2 { font-size: 18px; }
        .gmv-text h3 { font-size: 16px; }
        .gmv-text pre {
          padding: 12px 16px;
          font-size: 12px;
        }
        .gmv-text table {
          font-size: 12px;
          display: block;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
      }
      @media (max-width: 480px) {
        .gmv-files {
          width: 260px;
        }
        .gmv-header {
          padding: 20px 10px 10px;
        }
        .gmv-title {
          font-size: 22px;
        }
        .gmv-body {
          padding: 20px 8px 30px 8px;
          padding-right: calc(8px + 8px); /* Padding + miejsce na scrollbar */
        }
        .gmv-text {
          padding: 0 5px;
        }
        .gmv-text h1 { font-size: 20px; }
        .gmv-text h2 { font-size: 16px; }
        .gmv-text h3 { font-size: 14px; }
        .gmv-text code {
          font-size: 0.8em;
        }
        .gmv-text pre {
          padding: 10px 12px;
          font-size: 11px;
        }
      }

    `;
    document.head.appendChild(styles);
  }

  render() {
    this.container.style.height = this.height;
    this.container.style.overflow = 'hidden';
    
    this.container.innerHTML = `
      <div class="gmv-container ${this.theme}">
        <div class="gmv-progress"></div>
        <button class="gmv-menu-toggle">MENU</button> <!-- Przywrócony przycisk -->
        <div class="gmv-files-overlay"></div> <!-- Przywrócony overlay -->
        
        <aside class="gmv-files">
          <div class="gmv-label">FILES</div>
          <div class="gmv-files-list">
            <div class="gmv-loading">LOADING...</div>
          </div>
        </aside>
        
        <main class="gmv-content">
          <div class="gmv-empty">SELECT FILE TO VIEW</div>
        </main>
      </div>
    `;
    
    if (!window.gmvInstances) window.gmvInstances = {};
    window.gmvInstances[this.containerId] = this;
  }

  async loadDirectory() {
    const filesList = this.container.querySelector('.gmv-files-list');
    try {
      const headers = {
        'Accept': 'application/vnd.github.v3+json'
      };
      if (this.token) {
        headers['Authorization'] = `token ${this.token}`;
      }
      const response = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.path}?ref=${this.branch}`,
        { headers }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      this.files = data.filter(file => 
        file.type === 'file' && file.name.toLowerCase().endsWith('.md')
      );
      this.renderFileList();
    } catch (error) {
      filesList.innerHTML = `<div class="gmv-error">ERROR: ${error.message}</div>`;
    }
  }

  renderFileList() {
    const filesList = this.container.querySelector('.gmv-files-list');
    if (this.files.length === 0) {
      filesList.innerHTML = '<div class="gmv-error">NO FILES FOUND</div>';
      return;
    }
    const filesHtml = this.files.map((file, index) => {
      const displayName = this.formatFileName(file.name);
      const size = this.formatFileSize(file.size);
      return `
        <div class="gmv-file" data-path="${file.path}" data-index="${index}">
          <div class="gmv-file-name" title="${displayName}">${displayName}</div>
          <div class="gmv-file-meta">
            <span class="gmv-size">${size}</span>
          </div>
        </div>
      `;
    }).join('');
    filesList.innerHTML = filesHtml;
    const self = this;
    filesList.querySelectorAll('.gmv-file').forEach(item => {
      item.addEventListener('click', function() {
        self.loadFile(this.dataset.path);
      });
    });
    // Load first file
    if (this.files.length > 0) {
      setTimeout(() => {
        this.loadFile(this.files[0].path);
      }, 100);
    }
  }

  async loadFile(path) {
    const content = this.container.querySelector('.gmv-content');
    const files = this.container.querySelectorAll('.gmv-file');
    const progress = this.container.querySelector('.gmv-progress');
    // Update active state
    files.forEach(file => {
      file.classList.toggle('active', file.dataset.path === path);
    });
    // Reset progress
    progress.style.transform = 'scaleX(0)';
    // Show loading
    content.innerHTML = '<div class="gmv-empty">LOADING...</div>';
    try {
      const headers = {
        'Accept': 'application/vnd.github.v3+json'
      };
      if (this.token) {
        headers['Authorization'] = `token ${this.token}`;
      }
      const response = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`,
        { headers }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      const decodedContent = atob(data.content);
      const textContent = decodeURIComponent(escape(decodedContent));
      const readingTime = this.calculateReadingTime(textContent);
      const htmlContent = marked(textContent);
      const sanitizedHtml = DOMPurify.sanitize(htmlContent);
      let title = this.formatFileName(data.name);
      const firstH1 = textContent.match(/^#\s+(.+)$/m);
      if (firstH1) {
        title = firstH1[1].toUpperCase();
      }
      content.innerHTML = `
        <header class="gmv-header">
          <h1 class="gmv-title" title="${title}">${title}</h1>
          <div class="gmv-info">
            <span>${readingTime} MIN READ</span>
            <span>${this.formatFileSize(data.size)}</span>
          </div>
        </header>
        <article class="gmv-body">
          <div class="gmv-text">
            ${sanitizedHtml}
          </div>
        </article>
      `;
      // Ustaw początkową szerokość tekstu
      this.updateTextWidth();
      // Add scroll tracking
      const body = content.querySelector('.gmv-body');
      body.addEventListener('scroll', () => {
        const scrolled = body.scrollTop;
        const height = body.scrollHeight - body.clientHeight;
        const percentage = height > 0 ? scrolled / height : 0;
        progress.style.transform = `scaleX(${percentage})`;
      });
      this.currentFile = path;
    } catch (error) {
      content.innerHTML = `<div class="gmv-empty">ERROR: ${error.message}</div>`;
    }
  }

  toggleTheme() {
    const container = this.container.querySelector('.gmv-container');
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    container.classList.remove('light', 'dark');
    container.classList.add(this.theme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('gmv-theme', this.theme);
    }
  }

  setRepository(owner, repo, options = {}) {
    this.owner = owner;
    this.repo = repo;
    this.branch = options.branch || this.branch;
    this.path = options.path || this.path;
    this.loadDirectory();
  }

  refresh() {
    this.loadDirectory();
  }

  destroy() {
    if (window.gmvInstances && window.gmvInstances[this.containerId]) {
      delete window.gmvInstances[this.containerId];
    }
    this.container.innerHTML = '';
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GitHubMarkdownViewer;
} else if (typeof define === 'function' && define.amd) {
  define([], function() { return GitHubMarkdownViewer; });
} else {
  window.GitHubMarkdownViewer = GitHubMarkdownViewer;
}