
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

export const createFileContentTemplate = (title, readingTime, fileSize, sanitizedHtml, texts, prefix) => `
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