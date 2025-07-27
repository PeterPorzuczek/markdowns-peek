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

    // Wstrzyknij style synchronicznie
    this.injectStylesSync();
    // Po DOMContentLoaded rozpocznij polling
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.pollForStyles());
    } else {
      this.pollForStyles();
    }
  }

  injectStylesSync() {
    if (this.disableStyles) return;
    
    // Globalna mapa wstrzykniętych prefixów
    if (!window.__markdownsPeekStylePrefixes) {
      window.__markdownsPeekStylePrefixes = {};
    }
    
    const prefixKey = this.prefix;
    if (window.__markdownsPeekStylePrefixes[prefixKey]) {
      return; // Style już wstrzyknięte
    }
    
    const styleId = `markdowns-peek-styles-${prefixKey}`;
    if (document.getElementById(styleId)) {
      window.__markdownsPeekStylePrefixes[prefixKey] = true;
      return;
    }
    
    // Wstrzyknij style synchronicznie
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = this.processStyles(styles);
    document.head.appendChild(styleElement);
    
    // Oznacz jako wstrzyknięte
    window.__markdownsPeekStylePrefixes[prefixKey] = true;
    
    // WYMUŚ przetworzenie stylów przez przeglądarkę
    this.forceStyleProcessingSync();
  }

  forceStyleProcessingSync() {
    // Wymuś przetworzenie stylów przez przeglądarkę
    const testElement = document.createElement('div');
    testElement.className = this.prefix + 'container';
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    testElement.style.visibility = 'hidden';
    testElement.style.pointerEvents = 'none';
    document.body.appendChild(testElement);
    
    // Wymuś przeliczenie stylów - to jest kluczowe!
    const computedStyle = getComputedStyle(testElement);
    const display = computedStyle.display;
    
    document.body.removeChild(testElement);
    
    // Jeśli style nie są jeszcze przetworzone, spróbuj ponownie
    if (display !== 'flex') {
      // Style nie są jeszcze przetworzone, spróbuj ponownie
      this.forceStyleProcessingSync();
    }
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
    
    // Sprawdź czy style są aktywne
    if (this.areStylesActive()) {
      this.initSync();
      return;
    }
    
    // Jeśli style nie są aktywne i to nie jest pierwsza próba, spróbuj wymusić przetworzenie
    if (attempt > 0 && attempt % 10 === 0) {
      this.forceStyleReprocessing();
    }
    
    if (attempt < MAX_ATTEMPTS) {
      setTimeout(() => this.pollForStyles(attempt + 1), INTERVAL);
    } else {
      // Ostateczna próba - zresetuj widget
      this.resetWidget();
    }
  }

  areStylesActive() {
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
    // Usuń stary element style i wstrzyknij ponownie
    const styleId = `markdowns-peek-styles-${this.prefix}`;
    const oldStyle = document.getElementById(styleId);
    if (oldStyle) {
      oldStyle.remove();
    }
    
    // Wstrzyknij style ponownie
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = this.processStyles(styles);
    document.head.appendChild(styleElement);
    
    // Wymuś przetworzenie przez przeglądarkę
    const testElement = document.createElement('div');
    testElement.className = this.prefix + 'container';
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    testElement.style.visibility = 'hidden';
    testElement.style.pointerEvents = 'none';
    document.body.appendChild(testElement);
    
    // Wymuś przeliczenie stylów
    testElement.offsetHeight;
    testElement.offsetWidth;
    
    document.body.removeChild(testElement);
  }

  resetWidget() {
    // Ostateczna próba - zresetuj widget z nowym prefixem
    console.warn('MarkdownsPeek: resetting widget with new prefix due to style loading failure');
    
    // Wygeneruj nowy prefix
    this.prefix = generateDefaultPrefix();
    
    // Usuń stary element style
    const oldStyleId = `markdowns-peek-styles-${this.prefix}`;
    const oldStyle = document.getElementById(oldStyleId);
    if (oldStyle) {
      oldStyle.remove();
    }
    
    // Wstrzyknij style z nowym prefixem
    const styleElement = document.createElement('style');
    styleElement.id = `markdowns-peek-styles-${this.prefix}`;
    styleElement.textContent = this.processStyles(styles);
    document.head.appendChild(styleElement);
    
    // Wymuś przetworzenie stylów
    this.forceStyleReprocessing();
    
    // Spróbuj ponownie z nowym prefixem
    setTimeout(() => this.pollForStyles(0), 100);
  }

  initSync() {
    // Krok 1: Znajdź kontener
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error(`Container with id "${this.containerId}" not found`);
      return;
    }
    
    // Krok 2: Renderuj DOM
    this.renderSync();
    
    // Krok 3: Skonfiguruj menu mobilne
    this.setupMobileMenu();
    
    // Krok 4: Załaduj katalog
    this.loadDirectory();
    
    // Krok 5: Zaktualizuj szerokość tekstu
    this.updateTextWidth();
    
    // Krok 6: Dodaj listener resize
    window.addEventListener('resize', this.updateTextWidth.bind(this));
  }

  injectStylesSync() {
    if (this.disableStyles) return;
    
    // Globalna mapa wstrzykniętych prefixów
    if (!window.__markdownsPeekStylePrefixes) {
      window.__markdownsPeekStylePrefixes = {};
    }
    
    const prefixKey = this.prefix;
    if (window.__markdownsPeekStylePrefixes[prefixKey]) {
      return; // Style już wstrzyknięte
    }
    
    const styleId = `markdowns-peek-styles-${prefixKey}`;
    if (document.getElementById(styleId)) {
      window.__markdownsPeekStylePrefixes[prefixKey] = true;
      return;
    }
    
    // Wstrzyknij style synchronicznie
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = this.processStyles(styles);
    document.head.appendChild(styleElement);
    
    // Oznacz jako wstrzyknięte
    window.__markdownsPeekStylePrefixes[prefixKey] = true;
    
    // Wymuś przetworzenie stylów przez przeglądarkę
    this.forceStyleProcessing();
  }

  forceStyleProcessing() {
    // Wymuś przetworzenie stylów przez przeglądarkę
    const testElement = document.createElement('div');
    testElement.className = this.prefix + 'container';
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    testElement.style.visibility = 'hidden';
    testElement.style.pointerEvents = 'none';
    document.body.appendChild(testElement);
    
    // Wymuś przeliczenie stylów
    const computedStyle = getComputedStyle(testElement);
    const display = computedStyle.display;
    
    document.body.removeChild(testElement);
    
    // Sprawdź czy style są przetworzone (powinny być 'flex' dla container)
    if (display !== 'flex') {
      // Style nie są jeszcze przetworzone, spróbuj ponownie z limitem
      let attempts = 0;
      const maxAttempts = 10;
      
      const retry = () => {
        attempts++;
        if (attempts >= maxAttempts) {
          console.warn('Style processing timeout for prefix:', this.prefix);
          return;
        }
        
        const retryElement = document.createElement('div');
        retryElement.className = this.prefix + 'container';
        retryElement.style.position = 'absolute';
        retryElement.style.left = '-9999px';
        retryElement.style.visibility = 'hidden';
        retryElement.style.pointerEvents = 'none';
        document.body.appendChild(retryElement);
        
        const retryComputedStyle = getComputedStyle(retryElement);
        const retryDisplay = retryComputedStyle.display;
        
        document.body.removeChild(retryElement);
        
        if (retryDisplay !== 'flex') {
          setTimeout(retry, 10);
        }
      };
      
      setTimeout(retry, 10);
    }
  }

  renderSync() {
    this.container.style.height = this.height;
    this.container.style.overflow = 'hidden';
    // Złóż całość HTML widgetu
    const html = createMainTemplate(this.theme, this.texts, this.prefix);
    this.container.innerHTML = html;
    if (!window.viewerInstances) window.viewerInstances = {};
    window.viewerInstances[this.containerId] = this;
    // Dopiero teraz podpinaj eventy
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
        if (e.target.closest(`[class~="${this.prefix}file"]`)) {
          if (window.innerWidth <= 768) {
            filesPanel.classList.remove('active');
            overlay.classList.remove('active');
            this.updateTextWidth();
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



  processStyles(css) {
    const processed = css.replace(/\.lib-mp-/g, `.${this.prefix}`);
    return processed;
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
      // Złóż całość HTML listy plików i wstaw JEDNYM ruchem
      filesList.innerHTML = this.renderFileListHTML();
      this.attachFileListEvents();
      if (this.files.length > 0) {
        this.loadFile(this.files[0].path);
      }
    } catch (error) {
      filesList.innerHTML = createErrorTemplate(error.message, this.texts, this.prefix);
    }
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
      // Złóż całość HTML pliku i wstaw JEDNYM ruchem
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