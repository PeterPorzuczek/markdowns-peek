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
    
    this.container = null;
    this.currentFile = null;
    this.files = [];
    
    this.init();
  }

  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error(`Container with id "${this.containerId}" not found`);
      return;
    }
    
    this.injectStyles();
    this.render();
    this.loadDirectory();
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
      
      /* Left Panel */
      .gmv-files {
        width: 240px;
        padding: 40px 30px;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        overflow-y: auto;
        overflow-x: hidden;
        flex-shrink: 0;
        -webkit-overflow-scrolling: touch;
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
      }
      
      .gmv-header {
        padding: 40px 50px 30px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .gmv-title {
        font-size: 36px;
        font-weight: 700;
        letter-spacing: -0.02em;
        margin-bottom: 15px;
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
      }
      
      .gmv-body::-webkit-scrollbar {
        width: 1px;
      }
      
      .gmv-body::-webkit-scrollbar-thumb {
        background: #333;
      }
      
      .gmv-text {
        max-width: 900px;
        line-height: 1.6;
        font-size: 15px;
      }
      
      .gmv-text h1,
      .gmv-text h2,
      .gmv-text h3 {
        font-weight: 700;
        letter-spacing: -0.02em;
        margin: 2.5em 0 1em;
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
      }
      
      .gmv-text code {
        background: rgba(255, 255, 255, 0.05);
        padding: 2px 4px;
        font-family: 'SF Mono', Consolas, monospace;
        font-size: 0.85em;
      }
      
      .gmv-text pre {
        background: rgba(255, 255, 255, 0.02);
        border-left: 1px solid rgba(255, 255, 255, 0.1);
        padding: 15px 20px;
        overflow-x: auto;
        margin: 1.5em 0;
        font-size: 13px;
        line-height: 1.4;
      }
      
      .gmv-text blockquote {
        border-left: 1px solid #333;
        padding-left: 20px;
        margin: 1.5em 0;
        color: #999;
      }
      
      .gmv-text a {
        color: #fff;
        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 2px;
      }
      
      .gmv-text ul,
      .gmv-text ol {
        margin-bottom: 1.2em;
        padding-left: 20px;
      }
      
      .gmv-text li {
        margin-bottom: 0.3em;
        color: rgba(255, 255, 255, 0.8);
      }
      
      .gmv-text table {
        width: 100%;
        margin: 1.5em 0;
        font-size: 14px;
      }
      
      .gmv-text th,
      .gmv-text td {
        padding: 8px 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-align: left;
      }
      
      .gmv-text th {
        background: rgba(255, 255, 255, 0.02);
        font-weight: 600;
        font-size: 12px;
        letter-spacing: 0.03em;
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
        height: 1px;
        background: #fff;
        transform-origin: left;
        transform: scaleX(0);
        transition: transform 0.3s ease;
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
      
      .gmv-container.light .gmv-progress {
        background: #000;
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
          <div class="gmv-file-name">${displayName}</div>
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
          <h1 class="gmv-title">${title}</h1>
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

  // Public API
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