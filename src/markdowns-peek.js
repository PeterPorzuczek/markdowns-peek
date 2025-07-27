import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { styles } from './styles.js';
import { defaultTexts } from './texts.js';
import { generateDefaultPrefix } from './utils.js';
import {
  createMainTemplate,
  createFileTemplate,
  createFileContentTemplate,
  createErrorTemplate,
  createNoFilesTemplate,
  createLoadingTemplate
} from './templates.js';

class MarkdownsPeek {
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
    this.texts = { ...defaultTexts, ...options.texts };
    this.prefix = options.prefix || generateDefaultPrefix();
    
    this.container = null;
    this.currentFile = null;
    this.files = [];
    
    this.init();
  }

  updateTextWidth() {
    const body = this.container.querySelector(`[class~="${this.prefix}body"]`);
    const text = this.container.querySelector(`[class~="${this.prefix}text"]`);
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
    this.updateTextWidth();
    window.addEventListener('resize', this.updateTextWidth.bind(this));
  }
  
  setupMobileMenu() {
    const menuToggle = this.container.querySelector(`[class~="${this.prefix}menu-toggle"]`);
    const filesPanel = this.container.querySelector(`[class~="${this.prefix}files"]`);
    const overlay = this.container.querySelector(`[class~="${this.prefix}files-overlay"]`);
    
    if (menuToggle && filesPanel && overlay) {
      menuToggle.addEventListener('click', () => {
        filesPanel.classList.toggle('active');
        overlay.classList.toggle('active');
        this.updateTextWidth();
      });
      
      overlay.addEventListener('click', () => {
        filesPanel.classList.remove('active');
        overlay.classList.remove('active');
        this.updateTextWidth();
      });
      
      filesPanel.addEventListener('click', (e) => {
        if (e.target.closest(`.${this.prefix}file`)) {
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
    if (this.disableStyles) return;
    
    const styleId = `markdowns-peek-styles-${this.containerId}`;
    if (document.getElementById(styleId)) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = this.processStyles(styles);
    document.head.appendChild(styleElement);
  }

  processStyles(css) {
    return css.replace(/\.lib-mp-/g, `.${this.prefix}`);
  }

  render() {
    this.container.style.height = this.height;
    this.container.style.overflow = 'hidden';
    
    this.container.innerHTML = createMainTemplate(this.theme, this.texts, this.prefix);
    
    if (!window.viewerInstances) window.viewerInstances = {};
    window.viewerInstances[this.containerId] = this;
  }

  async loadDirectory() {
    const filesList = this.container.querySelector(`[class~="${this.prefix}files-list"]`);
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
      filesList.innerHTML = createErrorTemplate(error.message, this.texts, this.prefix);
    }
  }

  renderFileList() {
    const filesList = this.container.querySelector(`[class~="${this.prefix}files-list"]`);
    if (this.files.length === 0) {
      filesList.innerHTML = createNoFilesTemplate(this.texts, this.prefix);
      return;
    }
    const filesHtml = this.files.map((file, index) => {
      const displayName = this.formatFileName(file.name);
      const size = this.formatFileSize(file.size);
      return createFileTemplate(file, index, displayName, size, this.prefix);
    }).join('');
    filesList.innerHTML = filesHtml;
    const self = this;
    filesList.querySelectorAll(`[class~="${this.prefix}file"]`).forEach(item => {
      item.addEventListener('click', function() {
        self.loadFile(this.dataset.path);
      });
    });
    if (this.files.length > 0) {
      setTimeout(() => {
        this.loadFile(this.files[0].path);
      }, 100);
    }
  }

  async loadFile(path) {
    const content = this.container.querySelector(`[class~="${this.prefix}content"]`);
    const files = this.container.querySelectorAll(`[class~="${this.prefix}file"]`);
    const progress = this.container.querySelector(`[class~="${this.prefix}progress"]`);
    files.forEach(file => {
      file.classList.toggle('active', file.dataset.path === path);
    });
    progress.style.transform = 'scaleX(0)';
    content.innerHTML = createLoadingTemplate(this.texts, this.prefix);
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
      content.innerHTML = createFileContentTemplate(
        title,
        readingTime,
        this.formatFileSize(data.size),
        sanitizedHtml,
        this.texts,
        this.prefix
      );
      this.updateTextWidth();
      const body = content.querySelector(`[class~="${this.prefix}body"]`);
      body.addEventListener('scroll', () => {
        const scrolled = body.scrollTop;
        const height = body.scrollHeight - body.clientHeight;
        const percentage = height > 0 ? scrolled / height : 0;
        progress.style.transform = `scaleX(${percentage})`;
      });
      this.currentFile = path;
    } catch (error) {
      content.innerHTML = createErrorTemplate(error.message, this.texts, this.prefix);
    }
  }

  toggleTheme() {
    const container = this.container.querySelector(`[class~="${this.prefix}container"]`);
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    container.classList.remove('light', 'dark');
    container.classList.add(this.theme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lib-mp-theme', this.theme);
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
    if (window.viewerInstances && window.viewerInstances[this.containerId]) {
      delete window.viewerInstances[this.containerId];
    }
    this.container.innerHTML = '';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarkdownsPeek;
} else if (typeof define === 'function' && define.amd) {
  define([], function() { return MarkdownsPeek; });
} else {
  window.MarkdownsPeek = MarkdownsPeek;
}