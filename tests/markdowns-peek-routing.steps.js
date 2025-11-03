import { defineFeature, loadFeature } from 'jest-cucumber';
import { MarkdownsPeek } from '../src/markdowns-peek.js';

const feature = loadFeature('./tests/features/markdowns-peek-routing.feature');

defineFeature(feature, test => {
  let markdownsPeek;
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-routing-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (markdownsPeek) {
      if (markdownsPeek.destroy && typeof markdownsPeek.destroy === 'function') {
        markdownsPeek.destroy();
      }
      markdownsPeek = null;
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  test('Normalize path for comparison', ({ given, when, then, and }) => {
    given('I have a MarkdownsPeek instance', () => {
      markdownsPeek = new MarkdownsPeek({ 
        containerId: 'test-routing-container',
        disableStyles: true
      });
      expect(markdownsPeek).toBeTruthy();
    });

    when('I normalize paths with different formats', () => {
      expect(markdownsPeek.normalizePathForComparison).toBeDefined();
    });

    then('paths with hyphens should be normalized correctly', () => {
      const result = markdownsPeek.normalizePathForComparison('No-Codefall-Myth.md');
      expect(result).toBe('nocodefallmyth.md');
    });

    and('paths with spaces should be normalized correctly', () => {
      const result = markdownsPeek.normalizePathForComparison('No Codefall Myth.md');
      expect(result).toBe('nocodefallmyth.md');
    });

    and('paths with mixed hyphens and spaces should be normalized correctly', () => {
      const result = markdownsPeek.normalizePathForComparison('No-Codefall Myth.md');
      expect(result).toBe('nocodefallmyth.md');
    });
  });

  test('Find matching file path with exact match', ({ given, when, then }) => {
    given('I have a MarkdownsPeek instance with files loaded', () => {
      markdownsPeek = new MarkdownsPeek({ 
        containerId: 'test-routing-container',
        disableStyles: true
      });
      markdownsPeek.files = [
        { name: 'test-file.md', path: 'test-file.md' },
        { name: 'another file.md', path: 'another file.md' }
      ];
      expect(markdownsPeek.files.length).toBe(2);
    });

    when('I search for a file with exact path match', () => {
      expect(markdownsPeek.findMatchingFilePath).toBeDefined();
    });

    then('the correct file path should be returned', () => {
      const result = markdownsPeek.findMatchingFilePath('test-file.md');
      expect(result).toBe('test-file.md');
    });
  });

  test('Find matching file path with hyphens instead of spaces', ({ given, when, then }) => {
    given('I have a MarkdownsPeek instance with files loaded', () => {
      markdownsPeek = new MarkdownsPeek({ 
        containerId: 'test-routing-container',
        disableStyles: true
      });
      markdownsPeek.files = [
        { name: 'No-Codefall Myth.md', path: 'blog/No-Codefall Myth.md' }
      ];
      expect(markdownsPeek.files.length).toBe(1);
    });

    when('I search for a file using hyphens in place of spaces', () => {
      expect(markdownsPeek.findMatchingFilePath).toBeDefined();
    });

    then('the correct file path should be returned', () => {
      const result = markdownsPeek.findMatchingFilePath('No-Codefall-Myth.md');
      expect(result).toBe('blog/No-Codefall Myth.md');
    });
  });

  test('Find matching file path with spaces instead of hyphens', ({ given, when, then }) => {
    given('I have a MarkdownsPeek instance with files loaded', () => {
      markdownsPeek = new MarkdownsPeek({ 
        containerId: 'test-routing-container',
        disableStyles: true
      });
      markdownsPeek.files = [
        { name: 'Test-File-Name.md', path: 'blog/Test-File-Name.md' }
      ];
      expect(markdownsPeek.files.length).toBe(1);
    });

    when('I search for a file using spaces in place of hyphens', () => {
      expect(markdownsPeek.findMatchingFilePath).toBeDefined();
    });

    then('the correct file path should be returned', () => {
      const result = markdownsPeek.findMatchingFilePath('Test File Name.md');
      expect(result).toBe('blog/Test-File-Name.md');
    });
  });

  test('Find matching file path with mixed hyphens and spaces', ({ given, when, then }) => {
    given('I have a MarkdownsPeek instance with files loaded', () => {
      markdownsPeek = new MarkdownsPeek({ 
        containerId: 'test-routing-container',
        disableStyles: true
      });
      markdownsPeek.files = [
        { name: 'No-Codefall Myth.md', path: 'blog/No-Codefall Myth.md' }
      ];
      expect(markdownsPeek.files.length).toBe(1);
    });

    when('I search for a file with mixed hyphens and spaces', () => {
      expect(markdownsPeek.findMatchingFilePath).toBeDefined();
    });

    then('the correct file path should be returned', () => {
      const result1 = markdownsPeek.findMatchingFilePath('No-Codefall-Myth.md');
      expect(result1).toBe('blog/No-Codefall Myth.md');
      
      const result2 = markdownsPeek.findMatchingFilePath('No Codefall Myth.md');
      expect(result2).toBe('blog/No-Codefall Myth.md');
    });
  });

  test('Generate article URL path with hyphens', ({ given, when, then, and }) => {
    given('I have a MarkdownsPeek instance with routing enabled', () => {
      markdownsPeek = new MarkdownsPeek({ 
        containerId: 'test-routing-container',
        basePath: 'blog',
        enableRouting: true,
        disableStyles: true
      });
      expect(markdownsPeek.enableRouting).toBe(true);
      expect(markdownsPeek.basePath).toBe('blog');
    });

    when('I generate URL for a file with spaces', () => {
      expect(markdownsPeek.getArticleUrlPath).toBeDefined();
    });

    then('the URL should use hyphens instead of spaces', () => {
      const result = markdownsPeek.getArticleUrlPath('My Article File.md');
      expect(result).toBe('/blog/My-Article-File.md');
    });

    and('the URL should include the base path', () => {
      const result = markdownsPeek.getArticleUrlPath('Test.md');
      expect(result).toContain('/blog/');
    });
  });

  test('Handle URL encoded spaces', ({ given, when, then }) => {
    given('I have a MarkdownsPeek instance with files loaded', () => {
      markdownsPeek = new MarkdownsPeek({ 
        containerId: 'test-routing-container',
        disableStyles: true
      });
      markdownsPeek.files = [
        { name: 'Signals of Absence.md', path: 'blog/Signals of Absence.md' }
      ];
      expect(markdownsPeek.files.length).toBe(1);
    });

    when('I search for a file with URL encoded spaces', () => {
      expect(markdownsPeek.findMatchingFilePath).toBeDefined();
    });

    then('the correct file path should be returned', () => {
      const result = markdownsPeek.findMatchingFilePath('Signals of Absence.md');
      expect(result).toBe('blog/Signals of Absence.md');
    });
  });
});

