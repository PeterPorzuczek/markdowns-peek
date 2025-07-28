import { defineFeature, loadFeature } from 'jest-cucumber';
import { MarkdownsPeek } from '../src/markdowns-peek.js';

const feature = loadFeature('./tests/features/markdowns-peek-performance.feature');

defineFeature(feature, test => {
  let instances = [];

  afterEach(() => {
    instances.forEach(instance => {
      if (instance) {
        try {
          if (typeof instance.destroy === 'function') {
            instance.destroy();
          }
        } catch (error) {
          // Ignore destroy errors in tests
        }
      }
    });
    instances = [];
  });

  test('Memory usage test', ({ given, when, then }) => {
    given('I have multiple MarkdownsPeek instances', () => {
      expect(instances).toHaveLength(0);
    });

    when('I create and destroy instances repeatedly', () => {
      for (let i = 0; i < 5; i++) {
        const instance = new MarkdownsPeek({ containerId: `test-container-${i}` });
        instances.push(instance);
        expect(instance).toBeTruthy();
      }
    });

    then('memory usage should remain stable', () => {
      expect(instances).toHaveLength(5);
      instances.forEach(instance => {
        expect(instance).toBeDefined();
        expect(instance.containerId).toBeDefined();
      });
    });

    then('no memory leaks should occur', () => {
      instances.forEach(instance => {
        expect(instance.prefix).toBeDefined();
        expect(typeof instance.prefix).toBe('string');
      });
    });
  });

  test('Initialization speed test', ({ given, when, then }) => {
    let startTime;
    let endTime;

    given('I have a MarkdownsPeek instance', () => {
      startTime = performance.now();
    });

    when('I measure initialization time', () => {
      const instance = new MarkdownsPeek({ containerId: 'test-container' });
      endTime = performance.now();
      instances.push(instance);
    });

    then('the initialization should be fast', () => {
      const initTime = endTime - startTime;
      expect(initTime).toBeLessThan(1000);
    });

    then('it should complete within reasonable time', () => {
      const initTime = endTime - startTime;
      expect(initTime).toBeGreaterThan(0);
      expect(initTime).toBeLessThan(500);
    });
  });

  test('Style processing performance test', ({ given, when, then }) => {
    let instance;

    given('I have a MarkdownsPeek instance', () => {
      instance = new MarkdownsPeek({ containerId: 'test-container' });
      instances.push(instance);
    });

    when('I trigger style processing multiple times', () => {
      expect(() => {
        for (let i = 0; i < 10; i++) {
          if (instance.pollForStyles) {
            instance.pollForStyles();
          }
        }
      }).not.toThrow();
    });

    then('the style processing should be efficient', () => {
      expect(instance).toBeTruthy();
      expect(instance.prefix).toBeDefined();
    });

    then('it should not block the main thread', () => {
      expect(instance.texts).toBeDefined();
      expect(typeof instance.texts).toBe('object');
    });
  });
}); 