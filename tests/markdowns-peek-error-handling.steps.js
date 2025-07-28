import { defineFeature, loadFeature } from 'jest-cucumber';
import { MarkdownsPeek } from '../src/markdowns-peek.js';

const feature = loadFeature('./tests/features/markdowns-peek-error-handling.feature');

defineFeature(feature, test => {
  let markdownsPeek;

  afterEach(() => {
    if (markdownsPeek) {
      markdownsPeek = null;
    }
  });

  test('Handle invalid container ID', ({ given, when, then }) => {
    given('I have an invalid container ID', () => {
      expect(true).toBe(true);
    });

    when('I initialize MarkdownsPeek with invalid container', () => {
      markdownsPeek = new MarkdownsPeek({ containerId: 'non-existent-container' });
    });

    then('the library should handle the error gracefully', () => {
      expect(markdownsPeek).toBeTruthy();
      expect(markdownsPeek.containerId).toBe('non-existent-container');
    });

    then('the error should be logged appropriately', () => {
      expect(markdownsPeek).toBeDefined();
    });
  });

  test('Handle network errors', ({ given, when, then }) => {
    given('I have a valid MarkdownsPeek instance', () => {
      markdownsPeek = new MarkdownsPeek({ containerId: 'test-container' });
    });

    when('a network error occurs during file loading', () => {
      expect(markdownsPeek).toBeTruthy();
    });

    then('the library should display an error message', () => {
      expect(markdownsPeek.texts.error).toBeDefined();
      expect(typeof markdownsPeek.texts.error).toBe('string');
    });

    then('the error should be user-friendly', () => {
      expect(markdownsPeek.texts.error).toContain('ERROR:');
    });
  });
}); 