import { defineFeature, loadFeature } from 'jest-cucumber';
import { MarkdownsPeek } from '../src/markdowns-peek.js';

const feature = loadFeature('./tests/features/markdowns-peek-sorting.feature');

defineFeature(feature, test => {
  let markdownsPeek;
  let testFiles;

  afterEach(() => {
    if (markdownsPeek) {
      markdownsPeek = null;
    }
    testFiles = null;
  });

  test('Sort files alphabetically with numeric prefixes', ({ given, when, then, and }) => {
    given('I have a MarkdownsPeek instance with sortAlphabetically enabled', () => {
      markdownsPeek = new MarkdownsPeek({ 
        containerId: 'test-container',
        sortAlphabetically: true
      });
      expect(markdownsPeek).toBeTruthy();
      expect(markdownsPeek.sortAlphabetically).toBe(true);
    });

    when('I set files with numeric prefixes "001 cos", "002 moo", "003 foo"', () => {
      markdownsPeek.files = [
        { name: '001 cos.md', path: '001-cos.md' },
        { name: '002 moo.md', path: '002-moo.md' },
        { name: '003 foo.md', path: '003-foo.md' }
      ];
    });

    and('I call sortFilesAlphabetically', () => {
      markdownsPeek.sortFilesAlphabetically();
    });

    then('the files should be sorted in order "001 cos", "002 moo", "003 foo"', () => {
      expect(markdownsPeek.files[0].name).toBe('001 cos.md');
      expect(markdownsPeek.files[1].name).toBe('002 moo.md');
      expect(markdownsPeek.files[2].name).toBe('003 foo.md');
    });
  });

  test('Sort files with numeric prefixes in reverse order', ({ given, when, then, and }) => {
    given('I have a MarkdownsPeek instance with sortAlphabetically and reverseSortOrder enabled', () => {
      markdownsPeek = new MarkdownsPeek({ 
        containerId: 'test-container',
        sortAlphabetically: true,
        reverseSortOrder: true
      });
      expect(markdownsPeek).toBeTruthy();
      expect(markdownsPeek.sortAlphabetically).toBe(true);
      expect(markdownsPeek.reverseSortOrder).toBe(true);
    });

    when('I set files with numeric prefixes "001 cos", "002 moo", "003 foo"', () => {
      markdownsPeek.files = [
        { name: '001 cos.md', path: '001-cos.md' },
        { name: '002 moo.md', path: '002-moo.md' },
        { name: '003 foo.md', path: '003-foo.md' }
      ];
    });

    and('I call sortFilesAlphabetically', () => {
      markdownsPeek.sortFilesAlphabetically();
    });

    then('the files should be sorted in order "003 foo", "002 moo", "001 cos"', () => {
      expect(markdownsPeek.files[0].name).toBe('003 foo.md');
      expect(markdownsPeek.files[1].name).toBe('002 moo.md');
      expect(markdownsPeek.files[2].name).toBe('001 cos.md');
    });
  });

  test('Sort files with mixed numeric prefixes', ({ given, when, then, and }) => {
    given('I have a MarkdownsPeek instance with sortAlphabetically enabled', () => {
      markdownsPeek = new MarkdownsPeek({ 
        containerId: 'test-container',
        sortAlphabetically: true
      });
    });

    when('I set files with mixed numeric prefixes "10 test", "2 alpha", "1 beta", "20 gamma"', () => {
      markdownsPeek.files = [
        { name: '10 test.md', path: '10-test.md' },
        { name: '2 alpha.md', path: '2-alpha.md' },
        { name: '1 beta.md', path: '1-beta.md' },
        { name: '20 gamma.md', path: '20-gamma.md' }
      ];
    });

    and('I call sortFilesAlphabetically', () => {
      markdownsPeek.sortFilesAlphabetically();
    });

    then('the files should be sorted numerically as "1 beta", "2 alpha", "10 test", "20 gamma"', () => {
      expect(markdownsPeek.files[0].name).toBe('1 beta.md');
      expect(markdownsPeek.files[1].name).toBe('2 alpha.md');
      expect(markdownsPeek.files[2].name).toBe('10 test.md');
      expect(markdownsPeek.files[3].name).toBe('20 gamma.md');
    });
  });

  test('Sort files with mixed numeric prefixes in reverse order', ({ given, when, then, and }) => {
    given('I have a MarkdownsPeek instance with sortAlphabetically and reverseSortOrder enabled', () => {
      markdownsPeek = new MarkdownsPeek({ 
        containerId: 'test-container',
        sortAlphabetically: true,
        reverseSortOrder: true
      });
    });

    when('I set files with mixed numeric prefixes "10 test", "2 alpha", "1 beta", "20 gamma"', () => {
      markdownsPeek.files = [
        { name: '10 test.md', path: '10-test.md' },
        { name: '2 alpha.md', path: '2-alpha.md' },
        { name: '1 beta.md', path: '1-beta.md' },
        { name: '20 gamma.md', path: '20-gamma.md' }
      ];
    });

    and('I call sortFilesAlphabetically', () => {
      markdownsPeek.sortFilesAlphabetically();
    });

    then('the files should be sorted numerically in reverse as "20 gamma", "10 test", "2 alpha", "1 beta"', () => {
      expect(markdownsPeek.files[0].name).toBe('20 gamma.md');
      expect(markdownsPeek.files[1].name).toBe('10 test.md');
      expect(markdownsPeek.files[2].name).toBe('2 alpha.md');
      expect(markdownsPeek.files[3].name).toBe('1 beta.md');
    });
  });

  test('Sort files without sortAlphabetically option', ({ given, when, then, and }) => {
    given('I have a MarkdownsPeek instance without sortAlphabetically', () => {
      markdownsPeek = new MarkdownsPeek({ 
        containerId: 'test-container',
        sortAlphabetically: false
      });
      expect(markdownsPeek.sortAlphabetically).toBe(false);
    });

    when('I set files with numeric prefixes "003 foo", "001 cos", "002 moo"', () => {
      markdownsPeek.files = [
        { name: '003 foo.md', path: '003-foo.md' },
        { name: '001 cos.md', path: '001-cos.md' },
        { name: '002 moo.md', path: '002-moo.md' }
      ];
    });

    and('I attempt to use the files', () => {
      // Files should not be sorted automatically
      // Just verify the current state
    });

    then('the files should remain in original order "003 foo", "001 cos", "002 moo"', () => {
      expect(markdownsPeek.files[0].name).toBe('003 foo.md');
      expect(markdownsPeek.files[1].name).toBe('001 cos.md');
      expect(markdownsPeek.files[2].name).toBe('002 moo.md');
    });
  });

  test('Sort files with leading zeros', ({ given, when, then, and }) => {
    given('I have a MarkdownsPeek instance with sortAlphabetically enabled', () => {
      markdownsPeek = new MarkdownsPeek({ 
        containerId: 'test-container',
        sortAlphabetically: true
      });
    });

    when('I set files with leading zeros "001-first.md", "010-tenth.md", "002-second.md"', () => {
      markdownsPeek.files = [
        { name: '001-first.md', path: '001-first.md' },
        { name: '010-tenth.md', path: '010-tenth.md' },
        { name: '002-second.md', path: '002-second.md' }
      ];
    });

    and('I call sortFilesAlphabetically', () => {
      markdownsPeek.sortFilesAlphabetically();
    });

    then('the files should be sorted as "001-first.md", "002-second.md", "010-tenth.md"', () => {
      expect(markdownsPeek.files[0].name).toBe('001-first.md');
      expect(markdownsPeek.files[1].name).toBe('002-second.md');
      expect(markdownsPeek.files[2].name).toBe('010-tenth.md');
    });
  });

  test('Sort files with leading zeros in reverse order', ({ given, when, then, and }) => {
    given('I have a MarkdownsPeek instance with sortAlphabetically and reverseSortOrder enabled', () => {
      markdownsPeek = new MarkdownsPeek({ 
        containerId: 'test-container',
        sortAlphabetically: true,
        reverseSortOrder: true
      });
    });

    when('I set files with leading zeros "001-first.md", "010-tenth.md", "002-second.md"', () => {
      markdownsPeek.files = [
        { name: '001-first.md', path: '001-first.md' },
        { name: '010-tenth.md', path: '010-tenth.md' },
        { name: '002-second.md', path: '002-second.md' }
      ];
    });

    and('I call sortFilesAlphabetically', () => {
      markdownsPeek.sortFilesAlphabetically();
    });

    then('the files should be sorted in reverse as "010-tenth.md", "002-second.md", "001-first.md"', () => {
      expect(markdownsPeek.files[0].name).toBe('010-tenth.md');
      expect(markdownsPeek.files[1].name).toBe('002-second.md');
      expect(markdownsPeek.files[2].name).toBe('001-first.md');
    });
  });
});

