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
  createLoadingTemplate,
  createInitialLoaderTemplate
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
    this.sortAlphabetically = options.sortAlphabetically || false;
    this.showGitHubLink = options.showGitHubLink || false;
    this.texts = { ...defaultTexts, ...options.texts };
    this.prefix = options.prefix || generateDefaultPrefix();
    this.container = null;
    this.currentFile = null;
    this.files = [];
    this.isInitialized = false;
    this.isLoadingDirectory = false;
    this.isLoadingFile = false;
    this.directoryRetryAttempts = 0;
    this.maxDirectoryRetries = 3;
    
    this.injectStylesSync();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.pollForStyles());
    } else {
      this.pollForStyles();
    }
  }

  injectStylesSync() {
    if (this.disableStyles) return;
    
    this.initializeGlobalStyleMap();
    
    const prefixKey = this.prefix;
    if (this.isStyleAlreadyInjected(prefixKey)) {
      return;
    }
    
    const styleId = this.getStyleId(prefixKey);
    if (this.isStyleElementExists(styleId)) {
      this.markStyleAsInjected(prefixKey);
      return;
    }
    
    this.createAndInjectStyleElement(styleId);
    this.markStyleAsInjected(prefixKey);
  }

  initializeGlobalStyleMap() {
    if (!window.__markdownsPeekStylePrefixes) {
      window.__markdownsPeekStylePrefixes = {};
    }
  }

  isStyleAlreadyInjected(prefixKey) {
    return window.__markdownsPeekStylePrefixes[prefixKey];
  }

  isStyleElementExists(styleId) {
    return document.getElementById(styleId);
  }

  getStyleId(prefixKey) {
    return `markdowns-peek-styles-${prefixKey}`;
  }

  markStyleAsInjected(prefixKey) {
    window.__markdownsPeekStylePrefixes[prefixKey] = true;
  }

  createAndInjectStyleElement(styleId) {
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = this.processStyles(styles);
    document.head.appendChild(styleElement);
  }

  createTestElement() {
    const testElement = document.createElement('div');
    testElement.className = this.prefix + 'container';
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    testElement.style.visibility = 'hidden';
    testElement.style.pointerEvents = 'none';
    document.body.appendChild(testElement);
    return testElement;
  }

  pollForStyles(attempt = 0) {
    const MAX_ATTEMPTS = 100;
    const INTERVAL = 16;
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      if (attempt < MAX_ATTEMPTS) {
        setTimeout(() => this.pollForStyles(attempt + 1), INTERVAL);
      } else {
        console.error(`Container with id "${this.containerId}" not found`);
      }
      return;
    }
    
    if (attempt === 0) {
      this.showLoader();
    }
    
    if (this.disableStyles || this.areStylesActive()) {
      this.initSync();
      return;
    }
    
    if (attempt > 0 && attempt % 10 === 0) {
      this.forceStyleReprocessing();
    }
    
    if (attempt < MAX_ATTEMPTS) {
      setTimeout(() => this.pollForStyles(attempt + 1), INTERVAL);
    } else {
      this.resetWidget();
    }
  }

  showLoader() {
    this.container.style.height = this.height;
    this.container.style.overflow = 'hidden';
    this.container.innerHTML = createInitialLoaderTemplate(this.theme);
  }

  areStylesActive() {
    if (this.disableStyles) return true;
    
    const testElement = document.createElement('div');
    testElement.className = this.prefix + 'container';
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    testElement.style.visibility = 'hidden';
    testElement.style.pointerEvents = 'none';
    document.body.appendChild(testElement);
    const computedStyle = getComputedStyle(testElement);
    const display = computedStyle.display;
    document.body.removeChild(testElement);
    return display === 'flex';
  }

  forceStyleReprocessing() {
    if (this.disableStyles) return;
    
    this.removeOldStyleElement();
    this.createAndInjectStyleElement(this.getStyleId(this.prefix));
    this.forceStyleRecalculation();
  }

  removeOldStyleElement() {
    const styleId = this.getStyleId(this.prefix);
    const oldStyle = document.getElementById(styleId);
    if (oldStyle) {
      oldStyle.remove();
    }
  }

  forceStyleRecalculation() {
    const testElement = this.createTestElement();
    testElement.offsetHeight;
    testElement.offsetWidth;
    document.body.removeChild(testElement);
  }

  resetWidget() {
    if (this.disableStyles) {
      this.initSync();
      return;
    }
    
    console.warn('MarkdownsPeek: resetting widget with new prefix due to style loading failure');
    
    this.generateNewPrefix();
    this.removeOldStyleElement();
    this.createAndInjectStyleElement(this.getStyleId(this.prefix));
    this.forceStyleReprocessing();
    this.retryPollingAfterDelay();
  }

  generateNewPrefix() {
    this.prefix = generateDefaultPrefix();
  }

  retryPollingAfterDelay() {
    setTimeout(() => this.pollForStyles(0), 100);
  }

  initSync() {
    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;
    this.findContainer();
    this.renderSync();
    this.verifyPathAndLoad();
    this.updateTextWidth();
    this.addResizeListener();
  }

  async verifyPathAndLoad() {
    try {
        this.loadDirectory();
    } catch (error) {
      const filesList = this.container.querySelector(`[class~="${this.prefix}files-list"]`);
      filesList.innerHTML = createErrorTemplate(`Error loading path "${this.path}": ${error.message}`, this.texts, this.prefix);
    }
  }

  findContainer() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error(`Container with id "${this.containerId}" not found`);
      return;
    }
  }

  addResizeListener() {
    window.addEventListener('resize', this.updateTextWidth.bind(this));
  }



  renderSync() {
    this.container.style.height = this.height;
    this.container.style.overflow = 'hidden';
    const html = createMainTemplate(this.theme, this.texts, this.prefix);
    this.container.innerHTML = html;
    if (!window.viewerInstances) window.viewerInstances = {};
    window.viewerInstances[this.containerId] = this;
    this.setupMobileMenu();
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


  
  setupMobileMenu() {
    const elements = this.findMobileMenuElements();
    if (elements.menuToggle && elements.filesPanel && elements.overlay) {
      this.attachMobileMenuEventListeners(elements);
    }
  }

  findMobileMenuElements() {
    const primaryElements = this.findPrimaryMenuElements();
    if (primaryElements.menuToggle && primaryElements.filesPanel && primaryElements.overlay) {
      return primaryElements;
    }
    
    const fallbackElements = this.findFallbackMenuElements();
    if (fallbackElements.menuToggle && fallbackElements.filesPanel && fallbackElements.overlay) {
      return fallbackElements;
    }
    
    return this.findUniversalMenuElements();
  }

  findPrimaryMenuElements() {
    return {
      menuToggle: this.container.querySelector(`[class~="${this.prefix}menu-toggle"]`),
      filesPanel: this.container.querySelector(`[class~="${this.prefix}files"]`),
      overlay: this.container.querySelector(`[class~="${this.prefix}files-overlay"]`)
    };
  }

  findFallbackMenuElements() {
    return {
      menuToggle: this.container.querySelector(`.${this.prefix}menu-toggle`),
      filesPanel: this.container.querySelector(`.${this.prefix}files`),
      overlay: this.container.querySelector(`.${this.prefix}files-overlay`)
    };
  }

  findUniversalMenuElements() {
    const allElements = this.container.querySelectorAll('*');
    return {
      menuToggle: Array.from(allElements).find(el => 
        el.className && el.className.includes('menu-toggle')
      ),
      filesPanel: Array.from(allElements).find(el => 
        el.className && el.className.includes('files') && !el.className.includes('files-list') && !el.className.includes('files-overlay')
      ),
      overlay: Array.from(allElements).find(el => 
        el.className && el.className.includes('files-overlay')
      )
    };
  }

  attachMobileMenuEventListeners(elements) {
    this.attachMenuToggleListener(elements.menuToggle, elements.filesPanel, elements.overlay);
    this.attachOverlayClickListener(elements.overlay, elements.filesPanel);
    this.attachFilesPanelClickListener(elements.filesPanel, elements.overlay);
  }

  attachMenuToggleListener(menuToggle, filesPanel, overlay) {
      menuToggle.addEventListener('click', () => {
        filesPanel.classList.toggle('active');
        overlay.classList.toggle('active');
        this.updateTextWidth();
      });
  }
      
  attachOverlayClickListener(overlay, filesPanel) {
      overlay.addEventListener('click', () => {
        filesPanel.classList.remove('active');
        overlay.classList.remove('active');
        this.updateTextWidth();
      });
  }
      
  attachFilesPanelClickListener(filesPanel, overlay) {
      filesPanel.addEventListener('click', (e) => {
      if (this.isFileElementClicked(e)) {
          if (window.innerWidth <= 768) {
              filesPanel.classList.remove('active');
              overlay.classList.remove('active');
              this.updateTextWidth();
          }
        }
      });
    }

  isFileElementClicked(event) {
    const primaryFileSelector = event.target.closest(`[class~="${this.prefix}file"]`);
    if (primaryFileSelector) return true;
    
    const fallbackFileSelector = event.target.closest(`.${this.prefix}file`);
    if (fallbackFileSelector) return true;
    
    return event.target.closest('[class*="file"]');
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



  processStyles(css) {
    const processed = css.replace(/\.lib-mp-/g, `.${this.prefix}`);
    return processed;
  }



  async fetchGitHubContents(path) {
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
    
    return response.json();
  }

  async loadDirectory() {
    if (this.isLoadingDirectory) {
      return;
    }
    
    this.isLoadingDirectory = true;
    const filesList = this.container.querySelector(`[class~="${this.prefix}files-list"]`);

    try{
      const data = await this.fetchGitHubContents(this.path);

      if (Array.isArray(data)) {
        const normalizedPath = (this.path || '')
          .trim()
          .replace(/\/+/g, '/')
          .replace(/^\/+|\/+$/g, '');
          
        const prefix = normalizedPath ? normalizedPath + '/' : '';

        const validPath = Array.isArray(data) && data.every(item => {
          const url = item.html_url || '';

          return url.includes(normalizedPath);
        });

        if (!validPath && this.directoryRetryAttempts < this.maxDirectoryRetries) {
          this.directoryRetryAttempts++;
          this.isLoadingDirectory = false;
          setTimeout(() => {
            this.loadDirectory();
          }, 1000);
          return;
        }

        this.files = data.filter(file =>
          file.type === 'file' && file.name.toLowerCase().endsWith('.md') &&
          (!normalizedPath || file.path.startsWith(prefix))
        );
      } else {
        this.files = [];
      }
      
      this.directoryRetryAttempts = 0;
      
      if (this.sortAlphabetically) {
        this.sortFilesAlphabetically();
      }
      
      filesList.innerHTML = this.renderFileListHTML();
      this.attachFileListEvents();
      
      if (this.files.length > 0) {
        this.loadFile(this.files[0].path);
      }
      
      this.isLoadingDirectory = false;
    } catch (error) {
      this.isLoadingDirectory = false;
      this.directoryRetryAttempts = 0;
      filesList.innerHTML = createErrorTemplate(error.message, this.texts, this.prefix);
    }
  }
  


  sortFilesAlphabetically() {
    this.files.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderFileListHTML() {
    if (this.files.length === 0) {
      return createNoFilesTemplate(this.texts, this.prefix);
    }
    return this.files.map((file, index) => {
      const displayName = this.formatFileName(file.name);
      const size = this.formatFileSize(file.size);
      return createFileTemplate(file, index, displayName, size, this.prefix);
    }).join('');
  }

  attachFileListEvents() {
    const filesList = this.container.querySelector(`[class~="${this.prefix}files-list"]`);
    const self = this;
    filesList.querySelectorAll(`[class~="${this.prefix}file"]`).forEach(item => {
      item.addEventListener('click', function() {
        self.loadFile(this.dataset.path);
      });
    });
  }

  async loadFile(path) {
    if (this.isLoadingFile || this.currentFile === path) {
      return;
    }
    
    this.isLoadingFile = true;
    const content = this.container.querySelector(`[class~="${this.prefix}content"]`);
    const files = this.container.querySelectorAll(`[class~="${this.prefix}file"]`);
    const progress = this.container.querySelector(`[class~="${this.prefix}progress"]`);
    files.forEach(file => {
      file.classList.toggle('active', file.dataset.path === path);
    });
    progress.style.transform = 'scaleX(0)';
    content.innerHTML = createLoadingTemplate(this.texts, this.prefix);
    try {
      const data = await this.fetchGitHubContents(path);
      const decodedContent = atob(data.content);
      const textContent = decodeURIComponent(escape(decodedContent));
      const readingTime = this.calculateReadingTime(textContent);
      const htmlContent = marked(textContent);
      let sanitizedHtml = DOMPurify.sanitize(htmlContent);
      
      sanitizedHtml = sanitizedHtml.replace(
        /<a\s+([^>]*?)>/gi,
        (match, attributes) => {
          if (attributes.includes('target=')) {
            return match;
          }
          return `<a ${attributes} target="_blank" rel="noopener noreferrer">`;
        }
      );
      
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
        this.prefix,
        this.showGitHubLink ? data.html_url : null
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
      this.isLoadingFile = false;
    } catch (error) {
      this.isLoadingFile = false;
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
    this.isLoadingDirectory = false;
    this.directoryRetryAttempts = 0;
    this.loadDirectory();
  }

  refresh() {
    this.isLoadingDirectory = false;
    this.directoryRetryAttempts = 0;
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

export { MarkdownsPeek };