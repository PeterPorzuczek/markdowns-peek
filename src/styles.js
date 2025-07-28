export const styles = `
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