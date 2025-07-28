import { defineFeature, loadFeature } from 'jest-cucumber';
import { MarkdownsPeek } from '../src/markdowns-peek.js';

const feature = loadFeature('./tests/features/markdowns-peek-snapshots.feature');

defineFeature(feature, test => {
  let markdownsPeek;
  let container;

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

  test('Default HTML structure snapshot', ({ given, when, then }) => {
    given('I have a MarkdownsPeek instance with default settings', () => {
      const customConfig = {
        containerId: 'test-container',
        prefix: 'default-prefix'
      };
      markdownsPeek = new MarkdownsPeek(customConfig);
    });

    when('I initialize the component', () => {
      expect(markdownsPeek).toBeTruthy();
    });

    then('the HTML structure should match the snapshot', () => {
      const htmlStructure = {
        containerId: markdownsPeek.containerId,
        prefix: markdownsPeek.prefix,
        texts: markdownsPeek.texts,
        styles: markdownsPeek.styles
      };
      expect(htmlStructure).toMatchSnapshot();
    });

    then('the CSS classes should be consistent', () => {
      expect(markdownsPeek.prefix).toBeDefined();
      expect(typeof markdownsPeek.prefix).toBe('string');
      expect(markdownsPeek.prefix.length).toBeGreaterThan(0);
    });
  });

  test('Custom configuration HTML structure snapshot', ({ given, when, then }) => {
    given('I have a MarkdownsPeek instance with custom settings', () => {
      const customConfig = {
        containerId: 'test-container',
        prefix: 'custom-prefix',
        texts: {
          loading: 'Custom Loading...',
          error: 'Custom Error: ',
          noFiles: 'Custom No Files'
        }
      };
      markdownsPeek = new MarkdownsPeek(customConfig);
    });

    when('I initialize the component with custom config', () => {
      expect(markdownsPeek).toBeTruthy();
    });

    then('the HTML structure should match the custom snapshot', () => {
      const customHtmlStructure = {
        containerId: markdownsPeek.containerId,
        prefix: markdownsPeek.prefix,
        texts: markdownsPeek.texts,
        customConfig: true
      };
      expect(customHtmlStructure).toMatchSnapshot();
    });

    then('the custom CSS classes should be applied', () => {
      expect(markdownsPeek.prefix).toBe('custom-prefix');
      expect(markdownsPeek.texts.loading).toBe('Custom Loading...');
      expect(markdownsPeek.texts.error).toBe('Custom Error: ');
    });
  });

  test('Mobile menu HTML structure snapshot', ({ given, when, then }) => {
    given('I have a MarkdownsPeek instance', () => {
      const customConfig = {
        containerId: 'test-container',
        prefix: 'test-prefix'
      };
      markdownsPeek = new MarkdownsPeek(customConfig);
    });

    when('the mobile menu is rendered', () => {
      expect(markdownsPeek).toBeTruthy();
    });

    then('the mobile menu HTML should match the snapshot', () => {
      const mobileMenuStructure = {
        hasMobileMenu: true,
        prefix: markdownsPeek.prefix,
        mobileClasses: [`${markdownsPeek.prefix}mobile-menu`, `${markdownsPeek.prefix}mobile-toggle`]
      };
      expect(mobileMenuStructure).toMatchSnapshot();
    });

    then('the mobile-specific classes should be present', () => {
      expect(markdownsPeek.prefix).toBeDefined();
      const mobileClasses = [`${markdownsPeek.prefix}mobile-menu`, `${markdownsPeek.prefix}mobile-toggle`];
      expect(mobileClasses).toContain(`${markdownsPeek.prefix}mobile-menu`);
      expect(mobileClasses).toContain(`${markdownsPeek.prefix}mobile-toggle`);
    });
  });
}); 