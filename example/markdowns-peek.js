(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MarkdownsPeek = {}));
})(this, (function (exports) { 'use strict';

  var e={"":["<em>","</em>"],_:["<strong>","</strong>"],"*":["<strong>","</strong>"],"~":["<s>","</s>"],"\n":["<br />"]," ":["<br />"],"-":["<hr />"]};function n(e){return e.replace(RegExp("^"+(e.match(/^(\t| )+/)||"")[0],"gm"),"")}function r(e){return (e+"").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function t(a,c){var o,l,g,s,p,u=/((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*]|~~)/gm,m=[],h="",i=c||{},d=0;function f(n){var r=e[n[1]||""],t=m[m.length-1]==n;return r?r[1]?(t?m.pop():m.push(n),r[0|t]):r[0]:n}function $(){for(var e="";m.length;)e+=f(m[m.length-1]);return e}for(a=a.replace(/^\[(.+?)\]:\s*(.+)$/gm,function(e,n,r){return i[n.toLowerCase()]=r,""}).replace(/^\n+|\n+$/g,"");g=u.exec(a);)l=a.substring(d,g.index),d=u.lastIndex,o=g[0],l.match(/[^\\](\\\\)*\\$/)||((p=g[3]||g[4])?o='<pre class="code '+(g[4]?"poetry":g[2].toLowerCase())+'"><code'+(g[2]?' class="language-'+g[2].toLowerCase()+'"':"")+">"+n(r(p).replace(/^\n+|\n+$/g,""))+"</code></pre>":(p=g[6])?(p.match(/\./)&&(g[5]=g[5].replace(/^\d+/gm,"")),s=t(n(g[5].replace(/^\s*[>*+.-]/gm,""))),">"==p?p="blockquote":(p=p.match(/\./)?"ol":"ul",s=s.replace(/^(.*)(\n|$)/gm,"<li>$1</li>")),o="<"+p+">"+s+"</"+p+">"):g[8]?o='<img src="'+r(g[8])+'" alt="'+r(g[7])+'">':g[10]?(h=h.replace("<a>",'<a href="'+r(g[11]||i[l.toLowerCase()])+'">'),o=$()+"</a>"):g[9]?o="<a>":g[12]||g[14]?o="<"+(p="h"+(g[14]?g[14].length:g[13]>"="?1:2))+">"+t(g[12]||g[15],i)+"</"+p+">":g[16]?o="<code>"+r(g[16])+"</code>":(g[17]||g[1])&&(o=f(g[17]||"--"))),h+=l,h+=o;return (h+a.substring(d)+$()).replace(/^\n+|\n+$/g,"")}

  const styles = `
  .lib-mp-container {
    display: flex;
    position: relative;
    background: #000;
    color: #fff;
    font-family: -apple-system, system-ui, sans-serif;
    height: 100%;
    overflow: hidden;
    min-width: 0;
    max-width: 100%;
  }
  
  .lib-mp-container * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  .lib-mp-container {
    overflow: hidden;
  }
  
  .lib-mp-text * {
    max-width: 99%;
  }
  
  .lib-mp-files {
    width: 240px;
    padding: 40px 30px;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    overflow-y: auto;
    overflow-x: hidden;
    flex-shrink: 0;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
  }
  
  .lib-mp-files::-webkit-scrollbar {
    display: none;
  }
  
  .lib-mp-label {
    font-size: 10px;
    letter-spacing: 0.15em;
    color: #666;
    margin-bottom: 30px;
    font-weight: 500;
  }
  
  .lib-mp-file {
    padding: 15px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: padding-left 0.15s ease;
    position: relative;
  }
  
  .lib-mp-file:hover {
    padding-left: 10px;
  }
  
  .lib-mp-file.active::before {
    content: '';
    position: absolute;
    left: -30px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    background: #fff;
  }
  
  .lib-mp-file-name {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.03em;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .lib-mp-file-meta {
    font-size: 10px;
    color: #666;
    letter-spacing: 0.05em;
  }
  
  .lib-mp-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #000;
    position: relative;
  }
  
  .lib-mp-header {
    padding: 40px 50px 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
  }
  
  .lib-mp-title {
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
  
  .lib-mp-info {
    font-size: 10px;
    color: #666;
    letter-spacing: 0.1em;
  }
  
  .lib-mp-info span {
    margin-right: 15px;
  }
  
  .lib-mp-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 40px 50px 60px;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    padding-right: 8px;
    white-space: normal;
    line-height: 1.6;
  }

  .lib-mp-body br {
    display: inline;
    content: '';
  }
  
  .lib-mp-body::-webkit-scrollbar {
    width: 1px;
    background: transparent;
    transition: width 0.2s;
  }
  .lib-mp-body:hover::-webkit-scrollbar {
    width: 8px;
  }
  .lib-mp-body::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s, background 0.2s;
  }
  .lib-mp-body:hover::-webkit-scrollbar-thumb {
    opacity: 1;
    pointer-events: auto;
    background: #444;
  }
  
  .lib-mp-text {
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
  
  .lib-mp-text h1,
  .lib-mp-text h2,
  .lib-mp-text h3 {
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 2.5em 0 1em;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .lib-mp-text h1:first-child,
  .lib-mp-text h2:first-child {
    margin-top: 0;
  }
  
  .lib-mp-text h1 { font-size: 28px; }
  .lib-mp-text h2 { font-size: 20px; }
  .lib-mp-text h3 { font-size: 16px; }
  
  .lib-mp-text p {
    margin-bottom: 1.2em;
    color: rgba(255, 255, 255, 0.8);
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .lib-mp-text code {
    background: rgba(255, 255, 255, 0.05);
    padding: 2px 4px;
    font-family: 'SF Mono', Consolas, monospace;
    font-size: 0.85em;
    word-break: break-word;
  }
  
  .lib-mp-text pre {
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
  
  .lib-mp-text pre code {
    word-break: normal;
    white-space: pre;
  }
  
  .lib-mp-text blockquote {
    border-left: 1px solid #333;
    padding-left: 20px;
    margin: 1.5em 0;
    color: #999;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .lib-mp-text a {
    color: #fff;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  
  .lib-mp-text ul,
  .lib-mp-text ol {
    margin-bottom: 1.2em;
    padding-left: 20px;
    max-width: 100%;
  }
  
  .lib-mp-text li {
    margin-bottom: 0.3em;
    color: rgba(255, 255, 255, 0.8);
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .lib-mp-text table {
    width: 100%;
    margin: 1.5em 0;
    font-size: 14px;
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .lib-mp-text th,
  .lib-mp-text td {
    padding: 8px 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: left;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  
  .lib-mp-text th {
    background: rgba(255, 255, 255, 0.02);
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.03em;
  }
  
  .lib-mp-text img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1.5em 0;
  }
  
  .lib-mp-text hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin: 2em 0;
  }
  
  @media (max-width: 768px) {
    .lib-mp-text h4,
    .lib-mp-text h5,
    .lib-mp-text h6 {
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  }

  .lib-mp-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
    font-size: 11px;
    letter-spacing: 0.1em;
  }
  
  .lib-mp-loading {
    color: #666;
    font-size: 11px;
    letter-spacing: 0.1em;
    padding: 20px 0;
  }
  
  .lib-mp-error {
    color: #666;
    padding: 20px 0;
    font-size: 11px;
    letter-spacing: 0.05em;
  }
  
  .lib-mp-progress {
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
  
  .lib-mp-container.light {
    background: #fff;
    color: #000;
  }
  
  .lib-mp-container.light .lib-mp-files,
  .lib-mp-container.light .lib-mp-content {
    background: #fff;
  }
  
  .lib-mp-container.light .lib-mp-files,
  .lib-mp-container.light .lib-mp-header {
    border-color: rgba(0, 0, 0, 0.1);
  }
  
  .lib-mp-container.light .lib-mp-file {
    border-color: rgba(0, 0, 0, 0.05);
  }
  
  .lib-mp-container.light .lib-mp-file.active::before,
  .lib-mp-files {
    background: #000;
  }
  
  .lib-mp-container.light .lib-mp-label,
  .lib-mp-container.light .lib-mp-file-meta,
  .lib-mp-container.light .lib-mp-info {
    color: #999;
  }
  
  .lib-mp-container.light .lib-mp-text p,
  .lib-mp-container.light .lib-mp-text li {
    color: rgba(0, 0, 0, 0.8);
  }
  
  .lib-mp-container.light .lib-mp-text code {
    background: rgba(0, 0, 0, 0.05);
  }
  
  .lib-mp-container.light .lib-mp-text pre {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.1);
  }
  
  .lib-mp-container.light .lib-mp-text blockquote {
    border-color: #ccc;
    color: #666;
  }
  
  .lib-mp-container.light .lib-mp-text a {
    color: #000;
  }
  
  .lib-mp-container.light .lib-mp-text th,
  .lib-mp-container.light .lib-mp-text td {
    border-color: rgba(0, 0, 0, 0.1);
  }
  
  .lib-mp-container.light .lib-mp-text th {
    background: rgba(0, 0, 0, 0.02);
  }
  
  .lib-mp-container.light .lib-mp-empty {
    color: #ccc;
  }
  
  .lib-mp-container.light .lib-mp-body::-webkit-scrollbar-thumb {
    background: #ccc;
  }
  .lib-mp-container.light .lib-mp-body:hover::-webkit-scrollbar-thumb {
    background: #bbb;
  }
  
  .lib-mp-container.light .lib-mp-progress {
    background: #000;
  }
  
  .lib-mp-menu-toggle {
    display: none;
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 101;
    background: rgba(0, 0, 0, 1);
    border: 1px solid rgba(0, 0, 0, 1);
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: #fff;
    transition: all 0.2s ease;
    width: auto;
    min-width: 60px;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 5px;
  }
  .lib-mp-menu-toggle:hover {
    background: rgba(0, 0, 0, 1);
  }
  .lib-mp-container.light .lib-mp-menu-toggle {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(0, 0, 0, 1);
    color: #000;
  }
  .lib-mp-container.light .lib-mp-menu-toggle:hover {
    background: rgba(255, 255, 255, 1);
  }
  .lib-mp-files-overlay {
    display: none; 
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }
  @media (max-width: 768px) {
    .lib-mp-container {
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }
    .lib-mp-menu-toggle {
      display: block;
      position: absolute;
      top: 20px;
      left: 20px;
      width: auto;
      min-width: 60px;
      max-width: 120px;
      z-index: 1001;
    }
    .lib-mp-files {
      position: absolute;
      top: 0;
      left: -100%;
      width: 280px;
      height: 100%;
      z-index: 100;
      transition: left 0.3s ease;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
    }
    .lib-mp-files.active {
      left: 0;
    }
    .lib-mp-files-overlay.active {
      display: block;
    }
    .lib-mp-content {
      width: 100%;
      padding-top: 60px;
    }
    .lib-mp-header {
      padding: 30px 20px 20px;
    }
    .lib-mp-title {
      font-size: 28px;
      white-space: nowrap;
      word-wrap: break-word;
    }
    .lib-mp-body {
      padding: 30px 20px 40px 20px;
      padding-right: calc(20px + 8px);
    }
    .lib-mp-text {
      font-size: 14px;
      padding: 0 10px;
    }
    .lib-mp-text h1 { font-size: 24px; }
    .lib-mp-text h2 { font-size: 18px; }
    .lib-mp-text h3 { font-size: 16px; }
    .lib-mp-text pre {
      padding: 12px 16px;
      font-size: 12px;
    }
    .lib-mp-text table {
      font-size: 12px;
      display: block;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
  @media (max-width: 480px) {
    .lib-mp-menu-toggle {
      top: 10px;
      left: 10px;
      width: auto;
      min-width: 50px;
      max-width: 100px;
      padding: 6px 10px;
      font-size: 10px;
    }
    .lib-mp-files {
      width: 260px;
    }
    .lib-mp-header {
      padding: 20px 10px 10px;
    }
    .lib-mp-title {
      font-size: 22px;
    }
    .lib-mp-body {
      padding: 20px 8px 30px 8px;
      padding-right: calc(8px + 8px);
    }
    .lib-mp-text {
      padding: 0 5px;
    }
    .lib-mp-text h1 { font-size: 20px; }
    .lib-mp-text h2 { font-size: 16px; }
    .lib-mp-text h3 { font-size: 14px; }
    .lib-mp-text code {
      font-size: 0.8em;
    }
    .lib-mp-text pre {
      padding: 10px 12px;
      font-size: 11px;
    }
  }
`;

  const defaultTexts = {
    menu: 'MENU',
    files: 'FILES',
    loading: 'LOADING...',
    selectFile: 'SELECT FILE TO VIEW',
    error: 'ERROR: ',
    noFiles: 'NO FILES FOUND',
    minRead: 'MIN READ'
  };

  const generateRandomChars = (length = 8) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateDefaultPrefix = () => {
    return `${generateRandomChars(8)}-lib-mp-`;
  };

  const createMainTemplate = (theme, texts, prefix) => `
  <div class="${prefix}container ${theme}">
    <div class="${prefix}progress"></div>
    <button class="${prefix}menu-toggle">${texts.menu}</button>
    <div class="${prefix}files-overlay"></div>
    
    <aside class="${prefix}files">
      <div class="${prefix}label">${texts.files}</div>
      <div class="${prefix}files-list">
        <div class="${prefix}loading">${texts.loading}</div>
      </div>
    </aside>
    
    <main class="${prefix}content">
      <div class="${prefix}empty">${texts.selectFile}</div>
    </main>
  </div>
`;

  const createFileTemplate = (file, index, displayName, size, prefix) => `
  <div class="${prefix}file" data-path="${file.path}" data-index="${index}">
    <div class="${prefix}file-name" title="${displayName}">${displayName}</div>
    <div class="${prefix}file-meta">
      <span class="${prefix}size">${size}</span>
    </div>
  </div>
`;

  const createFileContentTemplate = (title, readingTime, fileSize, sanitizedHtml, texts, prefix) => `
  <header class="${prefix}header">
    <h1 class="${prefix}title" title="${title}">${title}</h1>
    <div class="${prefix}info">
      <span>${readingTime} ${texts.minRead}</span>
      <span>${fileSize}</span>
    </div>
  </header>
  <article class="${prefix}body">
    <div class="${prefix}text">
      ${sanitizedHtml}
    </div>
  </article>
`;

  const createErrorTemplate = (message, texts, prefix) => `
  <div class="${prefix}error">${texts.error}${message}</div>
`;

  const createNoFilesTemplate = (texts, prefix) => `
  <div class="${prefix}error">${texts.noFiles}</div>
`;

  const createLoadingTemplate = (texts, prefix) => `
  <div class="${prefix}empty">${texts.loading}</div>
`;

  const createInitialLoaderTemplate = (theme) => `
  <div style="
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
    color: ${theme === 'dark' ? '#ffffff' : '#333333'};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  ">
    <div style="
      width: 40px;
      height: 40px;
      border: 3px solid ${theme === 'dark' ? '#333333' : '#e0e0e0'};
      border-top: 3px solid ${theme === 'dark' ? '#ffffff' : '#333333'};
      border-radius: 50%;
      animation: spin 1s linear infinite;
    "></div>
  </div>
  <style>
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
`;

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
      this.texts = { ...defaultTexts, ...options.texts };
      this.prefix = options.prefix || generateDefaultPrefix();
      this.container = null;
      this.currentFile = null;
      this.files = [];
      
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
      this.findContainer();
      this.renderSync();
      this.verifyPathAndLoad();
      this.updateTextWidth();
      this.addResizeListener();
    }

    async verifyPathAndLoad() {
      if (!this.path || this.path === '') {
        this.loadDirectory();
        return;
      }
      
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
        if (response.ok) {
          this.loadDirectory();
        } else {
          const filesList = this.container.querySelector(`[class~="${this.prefix}files-list"]`);
          filesList.innerHTML = createErrorTemplate(`Path "${this.path}" not found`, this.texts, this.prefix);
        }
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



    async fetchGitHubContents(path = '') {
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
      const filesList = this.container.querySelector(`[class~="${this.prefix}files-list"]`);
      
      try {
        const data = await this.fetchGitHubContents(this.path);
        
        if (Array.isArray(data)) {
          this.files = data.filter(file => 
            file.type === 'file' && file.name.toLowerCase().endsWith('.md')
          );
        } else {
          this.files = [];
        }
        
        if (this.path && this.path !== '') {
          const filesInPath = this.files.filter(file => 
            file.path && file.path.startsWith(this.path + '/')
          );
          
          if (filesInPath.length === 0) {
            setTimeout(() => {
              this.loadDirectory();
            }, 1000);
            return;
          }
          
          this.files = filesInPath;
        }
        
        if (this.sortAlphabetically) {
          this.sortFilesAlphabetically();
        }
        
        filesList.innerHTML = this.renderFileListHTML();
        this.attachFileListEvents();
        
        if (this.files.length > 0) {
          this.loadFile(this.files[0].path);
        }
      } catch (error) {
        setTimeout(() => {
          this.loadDirectory();
        }, 1000);
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
        const sanitizedHtml = t(textContent);
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

  exports.MarkdownsPeek = MarkdownsPeek;

}));
//# sourceMappingURL=markdowns-peek.js.map
