
export const createMainTemplate = (theme, texts, prefix) => `
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

export const createFileTemplate = (file, index, displayName, size, prefix) => `
  <div class="${prefix}file" data-path="${file.path}" data-index="${index}">
    <div class="${prefix}file-name" title="${displayName}">${displayName}</div>
    <div class="${prefix}file-meta">
      <span class="${prefix}size">${size}</span>
    </div>
  </div>
`;

export const createFileContentTemplate = (title, readingTime, fileSize, sanitizedHtml, texts, prefix, htmlUrl, articleDate, articleUrl, articleAuthor) => `
  <header class="${prefix}header">
    <h1 class="${prefix}title" title="${title}">${title}</h1>
    <div class="${prefix}header-row">
      <div class="${prefix}info">
        <span>${readingTime} ${texts.minRead}</span>
        ${articleDate ? `<span>${articleDate}</span>` : `<span>${fileSize}</span>`}
        ${articleAuthor ? `<span>${texts.author}: ${articleAuthor}</span>` : ''}
      </div>
      <div class="${prefix}header-actions">
        ${articleUrl ? `
          <a href="${articleUrl}" class="${prefix}article-link" title="Open article page">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <path d="M15 3h6v6"/>
              <path d="M10 14L21 3"/>
            </svg>
          </a>
        ` : ''}
        ${htmlUrl ? `
          <a href="${htmlUrl}" target="_blank" rel="noopener noreferrer" class="${prefix}github-link" title="Open on GitHub">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        ` : ''}
      </div>
    </div>
  </header>
  <article class="${prefix}body">
    <div class="${prefix}text">
      ${sanitizedHtml}
    </div>
  </article>
`;

export const createErrorTemplate = (message, texts, prefix) => `
  <div class="${prefix}error">${texts.error}${message}</div>
`;

export const createNoFilesTemplate = (texts, prefix) => `
  <div class="${prefix}error">${texts.noFiles}</div>
`;

export const createLoadingTemplate = (texts, prefix) => `
  <div class="${prefix}empty">${texts.loading}</div>
`;

export const createInitialLoaderTemplate = (theme) => `
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