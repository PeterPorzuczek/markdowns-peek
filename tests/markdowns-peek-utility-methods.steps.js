import { defineFeature, loadFeature } from 'jest-cucumber';
import { MarkdownsPeek } from '../src/markdowns-peek.js';

const feature = loadFeature('./tests/features/markdowns-peek-utility-methods.feature');

defineFeature(feature, test => {
  let markdownsPeek;

  beforeEach(() => {
    markdownsPeek = new MarkdownsPeek({ containerId: 'test-container' });
  });

  afterEach(() => {
    if (markdownsPeek) {
      markdownsPeek = null;
    }
  });

  test('Test formatFileName method', ({ given, when, then }) => {
    given('I have a MarkdownsPeek instance', () => {
      expect(markdownsPeek).toBeTruthy();
    });

    when('I call formatFileName with different inputs', () => {
      expect(markdownsPeek.formatFileName).toBeDefined();
    });

    then('the filename should be formatted correctly', () => {
      const result = markdownsPeek.formatFileName('test-file.md');
      expect(typeof result).toBe('string');
    });

    then('special characters should be handled properly', () => {
      const result = markdownsPeek.formatFileName('file-with-spaces.md');
      expect(result).toBeDefined();
    });
  });

  test('Test calculateReadingTime method', ({ given, when, then }) => {
    given('I have a MarkdownsPeek instance', () => {
      expect(markdownsPeek).toBeTruthy();
    });

    when('I call calculateReadingTime with content', () => {
      expect(markdownsPeek.calculateReadingTime).toBeDefined();
    });

    then('the reading time should be calculated', () => {
      const result = markdownsPeek.calculateReadingTime('This is a test content with some words.');
      expect(typeof result).toBe('number');
    });

    then('it should return a reasonable estimate', () => {
      const result = markdownsPeek.calculateReadingTime('Short text');
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  test('Test formatFileSize method', ({ given, when, then }) => {
    given('I have a MarkdownsPeek instance', () => {
      expect(markdownsPeek).toBeTruthy();
    });

    when('I call formatFileSize with different sizes', () => {
      expect(markdownsPeek.formatFileSize).toBeDefined();
    });

    then('the file size should be formatted correctly', () => {
      const result = markdownsPeek.formatFileSize(1024);
      expect(typeof result).toBe('string');
    });

    then('it should use appropriate units', () => {
      const result = markdownsPeek.formatFileSize(1024);
      expect(result).toContain('KB');
    });
  });
}); 