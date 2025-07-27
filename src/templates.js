
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