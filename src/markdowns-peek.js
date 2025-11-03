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
    this.basePath = options.basePath || null;
    this.enableRouting = options.enableRouting !== undefined ? options.enableRouting : (this.basePath !== null);
    this.hideFilesOnRoute = options.hideFilesOnRoute !== undefined ? options.hideFilesOnRoute : true;
    this.loadFirstFileAutomatically = options.loadFirstFileAutomatically !== undefined ? options.loadFirstFileAutomatically : true;
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
    this.popstateHandler = null;
    
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
    this.setupRouting();
    this.updateContainerVisibility();
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

  parseMetadataFromComment(content) {
    // Allow optional whitespace at the beginning
    const metadataRegex = /^\s*<!--\s*([\s\S]*?)\s*-->/;
    const match = content.match(metadataRegex);
    
    if (!match) {
      return null;
    }
    
    const metadataText = match[1];
    const metadata = {};
    
    // Parse date - support both with and without quotes, and different hyphen types
    const dateMatch = metadataText.match(/date:\s*["']?(\d{4}[\-\u2010-\u2015]\d{2}[\-\u2010-\u2015]\d{2})["']?/);
    if (dateMatch) {
      // Normalize hyphens to standard minus sign
      metadata.date = dateMatch[1].replace(/[\u2010-\u2015]/g, '-');
    }
    
    // Parse author - support both with and without quotes
    const authorMatch = metadataText.match(/author:\s*["']?([^"'\n]+)["']?/);
    if (authorMatch) {
      metadata.author = authorMatch[1].trim();
    }
    
    // Parse title
    const titleMatch = metadataText.match(/title:\s*["']([^"']+)["']/);
    if (titleMatch) {
      metadata.title = titleMatch[1];
    }
    
    // Parse description
    const descriptionMatch = metadataText.match(/description:\s*["']([^"']+)["']/);
    if (descriptionMatch) {
      metadata.description = descriptionMatch[1];
    }
    
    // Parse tags
    const tagsMatch = metadataText.match(/tags:\s*\[([^\]]+)\]/);
    if (tagsMatch) {
      metadata.tags = tagsMatch[1].split(',').map(tag => tag.trim().replace(/["']/g, ''));
    }
    
    return metadata;
  }

  formatDate(dateString) {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  }

  getArticleUrlPath(filePath) {
    if (!this.enableRouting || !this.basePath) {
      return null;
    }
    
    const urlPath = filePath.replace(/\s+/g, '-');
    return `/${this.basePath}/${urlPath}`;
  }

  parseUrlForArticle() {
    if (!this.enableRouting || !this.basePath) {
      return null;
    }
    
    const pathname = window.location.pathname;
    const basePrefix = `/${this.basePath}/`;
    
    if (!pathname.startsWith(basePrefix)) {
      return null;
    }
    
    const encodedPath = pathname.substring(basePrefix.length);
    
    try {
      return decodeURIComponent(encodedPath);
    } catch (e) {
      console.error('Failed to decode article path:', e);
      return null;
    }
  }

  normalizePathForComparison(path) {
    return path.replace(/[-\s]+/g, '').toLowerCase();
  }

  findMatchingFilePath(urlPath) {
    const urlPathFilename = urlPath.split('/').pop();
    const normalizedUrl = this.normalizePathForComparison(urlPathFilename);
    
    const matchingFile = this.files.find(f => {
      const filename = f.name || f.path.split('/').pop();
      const normalizedFilename = this.normalizePathForComparison(filename);
      return normalizedFilename === normalizedUrl;
    });
    
    return matchingFile ? matchingFile.path : null;
  }

  updateUrlForArticle(filePath, replace = false) {
    if (!this.enableRouting || !this.basePath) {
      return;
    }
    
    const url = this.getArticleUrlPath(filePath);
    if (url) {
      if (replace) {
        window.history.replaceState({ filePath }, '', url);
      } else {
        window.history.pushState({ filePath }, '', url);
      }
    }
  }

  setupRouting() {
    if (!this.enableRouting) return;
    
    this.popstateHandler = (event) => {
      this.updateContainerVisibility();
      
      const currentPath = window.location.pathname;
      const basePrefix = `/${this.basePath}/`;
      
      if (!currentPath.startsWith(basePrefix) && currentPath !== `/${this.basePath}`) {
        return;
      }
      
      if (event.state && event.state.filePath) {
        if (this.hideFilesOnRoute) {
          this.hideFilesPanel();
        }
        this.loadFile(event.state.filePath, true, true);
      } else {
        this.showFilesPanel();
        const content = this.container.querySelector(`[class~="${this.prefix}content"]`);
        if (content) {
          content.innerHTML = `<div class="${this.prefix}empty">${this.texts.selectFile}</div>`;
        }
        this.currentFile = null;
        const files = this.container.querySelectorAll(`[class~="${this.prefix}file"]`);
        files.forEach(file => file.classList.remove('active'));
      }
    };
    
    window.addEventListener('popstate', this.popstateHandler);
  }

  checkIfUrlMatchesInstance() {
    if (!this.enableRouting || !this.basePath) {
      return true;
    }
    
    const currentPath = window.location.pathname;
    const basePrefix = `/${this.basePath}/`;
    
    return currentPath.startsWith(basePrefix);
  }
  
  updateContainerVisibility() {
    if (!this.container) return;
    
    if (!this.hideFilesOnRoute || !this.loadFirstFileAutomatically) {
      this.container.style.display = '';
      return;
    }
    
    if (typeof window === 'undefined' || !window.location) {
      this.container.style.display = '';
      return;
    }
    
    const currentPath = window.location.pathname;
    const myBasePath = `/${this.basePath}/`;
    const isMyRoute = currentPath.startsWith(myBasePath);
    const isArticleRoute = currentPath.match(/^\/[^\/]+\/.+/);
    
    if (isMyRoute) {
      this.container.style.display = '';
    } else if (isArticleRoute) {
      this.container.style.display = 'none';
    } else {
      this.container.style.display = '';
    }
  }

  loadArticleFromUrl() {
    this.updateContainerVisibility();
    
    const urlPath = this.parseUrlForArticle();
    
    if (urlPath) {
      if (this.hideFilesOnRoute) {
        this.hideFilesPanel();
      }
      
      const matchingFilePath = this.findMatchingFilePath(urlPath);
      if (matchingFilePath) {
        this.loadFile(matchingFilePath, true, true);
      } else {
        this.show404();
      }
      return;
    }
    
    this.showFilesPanel();
    
    if (typeof window !== 'undefined' && window.location) {
      const currentPath = window.location.pathname;
      const isArticleRoute = currentPath.match(/^\/[^\/]+\/.+/);
      
      if (isArticleRoute) {
        return;
      }
    }
    
    if (this.files.length > 0) {
      this.loadFile(this.files[0].path, false, this.loadFirstFileAutomatically);
    }
  }

  show404() {
    const content = this.container.querySelector(`[class~="${this.prefix}content"]`);
    if (content) {
      content.innerHTML = `<div class="${this.prefix}error">${this.texts.notFound}</div>`;
    }
  }

  hideFilesPanel() {
    const mainContainer = this.container.querySelector(`[class~="${this.prefix}container"]`);
    if (mainContainer) {
      mainContainer.classList.add('fullscreen-article');
    }
  }

  showFilesPanel() {
    const mainContainer = this.container.querySelector(`[class~="${this.prefix}container"]`);
    if (mainContainer) {
      mainContainer.classList.remove('fullscreen-article');
    }
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
      
      // Check if we should load article from URL (deep linking)
      if (this.enableRouting) {
        this.loadArticleFromUrl();
      } else if (this.files.length > 0) {
        // No routing - load first file, updateUrl based on loadFirstFileAutomatically
        this.loadFile(this.files[0].path, false, this.loadFirstFileAutomatically);
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
        // When clicking in menu, respect loadFirstFileAutomatically setting for URL updates
        self.loadFile(this.dataset.path, false, self.loadFirstFileAutomatically);
      });
    });
  }

  async loadFile(path, fromUrl = false, updateUrl = true) {
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
      
      // Parse metadata from HTML comment
      const metadata = this.parseMetadataFromComment(textContent);
      const articleDate = metadata && metadata.date ? this.formatDate(metadata.date) : null;
      const articleAuthor = metadata && metadata.author ? metadata.author : null;
      
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
      
      // Get full article URL for "open in new tab" button
      const articleUrl = this.enableRouting ? this.getArticleUrlPath(path) : null;
      const fullArticleUrl = articleUrl ? `${window.location.origin}${articleUrl}` : null;
      
      content.innerHTML = createFileContentTemplate(
        title,
        readingTime,
        this.formatFileSize(data.size),
        sanitizedHtml,
        this.texts,
        this.prefix,
        this.showGitHubLink ? data.html_url : null,
        articleDate,
        fullArticleUrl,
        articleAuthor
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
      
      // Update URL if not coming from URL navigation and updateUrl is true
      if (!fromUrl && updateUrl) {
        this.updateUrlForArticle(path);
      }
      
      this.isLoadingFile = false;
    } catch (error) {
      this.isLoadingFile = false;
      content.innerHTML = createErrorTemplate(error.message, this.texts, this.prefix);
      
      // Show 404 if file not found and routing is enabled
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        this.show404();
      }
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
    this.basePath = options.basePath || this.basePath;
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
    
    if (this.popstateHandler) {
      window.removeEventListener('popstate', this.popstateHandler);
      this.popstateHandler = null;
    }
    
    if (this.container) {
      this.container.innerHTML = '';
    }
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