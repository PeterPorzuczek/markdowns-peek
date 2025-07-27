import { defineFeature, loadFeature } from 'jest-cucumber';
import { MarkdownsPeek } from '../src/markdowns-peek.js';

const feature = loadFeature('./tests/features/markdowns-peek-custom-config.feature');

defineFeature(feature, test => {
  let container;
  let markdownsPeek;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container-custom';
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (markdownsPeek) {
      markdownsPeek = null;
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  test('Initialize MarkdownsPeek with custom configuration', ({ given, when, then }) => {
    given('I have a container element in the DOM', () => {
      expect(container).toBeTruthy();
      expect(container.id).toBe('test-container-custom');
    });

    when('I initialize MarkdownsPeek with custom options', () => {
      const customOptions = {
        containerId: 'test-container-custom',
        prefix: 'custom-prefix-',
        disableStyles: true,
        sortAlphabetically: true,
        texts: {
          menu: 'Custom Menu',
          files: 'Custom Files',
          loading: 'Custom Loading...',
          selectFile: 'Custom Select File',
          error: 'Custom Error:',
          noFiles: 'Custom No Files Found'
        }
      };
      
      markdownsPeek = new MarkdownsPeek(customOptions);
    });

    then('the library should be initialized with custom configuration', () => {
      expect(markdownsPeek).toBeTruthy();
      expect(markdownsPeek.prefix).toBe('custom-prefix-');
      expect(markdownsPeek.disableStyles).toBe(true);
      expect(markdownsPeek.sortAlphabetically).toBe(true);
      expect(markdownsPeek.texts.menu).toBe('Custom Menu');
      expect(markdownsPeek.texts.files).toBe('Custom Files');
      expect(markdownsPeek.texts.loading).toBe('Custom Loading...');
    });

    then('the container should have custom CSS classes', () => {
      expect(markdownsPeek.containerId).toBe('test-container-custom');
    });

    then('no styles should be injected when disableStyles is true', () => {
      const styleElements = document.querySelectorAll('style');
      const customStyleElements = Array.from(styleElements).filter(style => 
        style.textContent.includes('custom-prefix-')
      );
      expect(customStyleElements.length).toBe(0);
    });
  });
}); 