import { defineFeature, loadFeature } from 'jest-cucumber';
import { MarkdownsPeek } from '../src/markdowns-peek.js';

const feature = loadFeature('./tests/features/markdowns-peek-edge-cases.feature');

defineFeature(feature, test => {
  let markdownsPeek;

  afterEach(() => {
    if (markdownsPeek) {
      markdownsPeek = null;
    }
  });

  test('Empty configuration test', ({ given, when, then }) => {
    given('I have an empty configuration object', () => {
      expect({}).toEqual({});
    });

    when('I initialize MarkdownsPeek with empty config', () => {
      expect(() => {
        markdownsPeek = new MarkdownsPeek({});
      }).not.toThrow();
    });

    then('it should use default values', () => {
      expect(markdownsPeek).toBeTruthy();
      expect(markdownsPeek.prefix).toBeDefined();
      expect(markdownsPeek.texts).toBeDefined();
    });

    then('it should not throw an error', () => {
      expect(markdownsPeek.containerId).toBe('markdowns-peek');
      expect(typeof markdownsPeek.prefix).toBe('string');
      expect(markdownsPeek.prefix).toBeDefined();
      expect(markdownsPeek.texts).toBeDefined();
    });
  });

  test('Null and undefined values test', ({ given, when, then }) => {
    given('I have null and undefined values in config', () => {
      expect(null).toBeNull();
      expect(undefined).toBeUndefined();
    });

    when('I initialize MarkdownsPeek with null values', () => {
      expect(() => {
        markdownsPeek = new MarkdownsPeek({
          containerId: null,
          prefix: undefined,
          texts: null
        });
      }).not.toThrow();
    });

    then('it should handle null values gracefully', () => {
      expect(markdownsPeek).toBeTruthy();
      expect(markdownsPeek.containerId).toBe('markdowns-peek');
      expect(markdownsPeek.prefix).toBeDefined();
      expect(markdownsPeek.texts).toBeDefined();
    });

    then('it should use fallback values', () => {
      expect(markdownsPeek.prefix).toBeDefined();
      expect(typeof markdownsPeek.prefix).toBe('string');
      expect(markdownsPeek.texts).toBeDefined();
    });
  });

  test('Very long text values test', ({ given, when, then }) => {
    given('I have very long text values in configuration', () => {
      const longText = 'A'.repeat(1000);
      expect(longText.length).toBe(1000);
    });

    when('I initialize MarkdownsPeek with long texts', () => {
      const longText = 'A'.repeat(1000);
      expect(() => {
        markdownsPeek = new MarkdownsPeek({
          containerId: 'test-container',
          texts: {
            loading: longText,
            error: longText,
            noFiles: longText
          }
        });
      }).not.toThrow();
    });

    then('it should handle long texts without issues', () => {
      expect(markdownsPeek).toBeTruthy();
      expect(markdownsPeek.texts.loading).toBeDefined();
    });

    then('the texts should be preserved correctly', () => {
      const longText = 'A'.repeat(1000);
      expect(markdownsPeek.texts.loading).toBe(longText);
      expect(markdownsPeek.texts.error).toBe(longText);
      expect(markdownsPeek.texts.noFiles).toBe(longText);
    });
  });

  test('Special characters in prefix test', ({ given, when, then }) => {
    given('I have special characters in the prefix', () => {
      const specialPrefix = 'test-prefix-123_';
      expect(specialPrefix).toMatch(/[a-zA-Z0-9_-]/);
    });

    when('I initialize MarkdownsPeek with special prefix', () => {
      const specialPrefix = 'test-prefix-123_';
      expect(() => {
        markdownsPeek = new MarkdownsPeek({
          containerId: 'test-container',
          prefix: specialPrefix
        });
      }).not.toThrow();
    });

    then('it should handle special characters properly', () => {
      expect(markdownsPeek).toBeTruthy();
      expect(markdownsPeek.prefix).toBe('test-prefix-123_');
    });

    then('the prefix should be valid for CSS classes', () => {
      const cssClass = `${markdownsPeek.prefix}container`;
      expect(cssClass).toMatch(/^[a-zA-Z0-9_-]+container$/);
    });
  });
}); 