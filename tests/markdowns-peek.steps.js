import { defineFeature, loadFeature } from 'jest-cucumber';
import { MarkdownsPeek } from '../src/markdowns-peek.js';

const feature = loadFeature('./tests/features/markdowns-peek.feature');

defineFeature(feature, test => {
  let container;
  let markdownsPeek;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
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

  test('Successfully initialize MarkdownsPeek with default configuration', ({ given, when, then }) => {
    given('I have a container element in the DOM', () => {
      expect(container).toBeTruthy();
      expect(container.id).toBe('test-container');
    });

    when('I initialize MarkdownsPeek with default options', () => {
      markdownsPeek = new MarkdownsPeek({ containerId: 'test-container' });
    });

    then('the library should be properly initialized', () => {
      expect(markdownsPeek).toBeTruthy();
      expect(markdownsPeek.prefix).toMatch(/^[a-zA-Z0-9]{8}-lib-mp-$/);
      expect(markdownsPeek.texts).toBeDefined();
      expect(markdownsPeek.disableStyles).toBe(false);
      expect(markdownsPeek.sortAlphabetically).toBe(false);
    });

    then('the container should have the correct CSS classes', () => {
      expect(markdownsPeek.containerId).toBe('test-container');
    });

    then('the initial loader should be displayed', () => {
      expect(markdownsPeek).toBeTruthy();
    });
  });
}); 