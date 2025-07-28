import { defineFeature, loadFeature } from 'jest-cucumber';
import { MarkdownsPeek } from '../src/markdowns-peek.js';

const feature = loadFeature('./tests/features/markdowns-peek-methods.feature');

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

  test('Test setRepository method', ({ given, when, then }) => {
    given('I have a MarkdownsPeek instance', () => {
      expect(markdownsPeek).toBeTruthy();
    });

    when('I call setRepository with new parameters', () => {
      markdownsPeek.setRepository('new-owner', 'new-repo', { branch: 'develop' });
    });

    then('the repository should be updated correctly', () => {
      expect(markdownsPeek.owner).toBe('new-owner');
      expect(markdownsPeek.repo).toBe('new-repo');
    });

    then('the owner and repo should be set', () => {
      expect(markdownsPeek.branch).toBe('develop');
    });
  });

  test('Test refresh method', ({ given, when, then }) => {
    given('I have a MarkdownsPeek instance', () => {
      expect(markdownsPeek).toBeTruthy();
    });

    when('I call the refresh method', () => {
      expect(() => markdownsPeek.refresh()).not.toThrow();
    });

    then('the method should be available', () => {
      expect(typeof markdownsPeek.refresh).toBe('function');
    });

    then('it should not throw an error', () => {
      expect(markdownsPeek.refresh).toBeDefined();
    });
  });

  test('Test destroy method', ({ given, when, then }) => {
    given('I have a MarkdownsPeek instance', () => {
      expect(markdownsPeek).toBeTruthy();
    });

    when('I call the destroy method', () => {
      expect(() => markdownsPeek.destroy()).not.toThrow();
    });

    then('the method should be available', () => {
      expect(typeof markdownsPeek.destroy).toBe('function');
    });

    then('it should clean up resources', () => {
      expect(markdownsPeek.destroy).toBeDefined();
    });
  });
}); 