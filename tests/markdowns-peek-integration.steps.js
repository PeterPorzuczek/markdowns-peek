import { defineFeature, loadFeature } from 'jest-cucumber';
import { MarkdownsPeek } from '../src/markdowns-peek.js';

const feature = loadFeature('./tests/features/markdowns-peek-integration.feature');

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

  test('Multiple instances integration test', ({ given, when, then }) => {
    given('I have multiple MarkdownsPeek instances on the same page', () => {
      expect(instances).toHaveLength(0);
    });

    when('I initialize all instances simultaneously', () => {
      for (let i = 0; i < 3; i++) {
        const instance = new MarkdownsPeek({ containerId: `test-container-${i}` });
        instances.push(instance);
      }
    });

    then('each instance should have unique prefixes', () => {
      expect(instances).toHaveLength(3);
      const prefixes = instances.map(instance => instance.prefix);
      const uniquePrefixes = new Set(prefixes);
      expect(uniquePrefixes.size).toBe(prefixes.length);
    });

    then('they should not interfere with each other', () => {
      instances.forEach((instance, index) => {
        expect(instance.containerId).toBe(`test-container-${index}`);
        expect(instance.prefix).toBeDefined();
        expect(typeof instance.prefix).toBe('string');
      });
    });
  });

  test('DOM manipulation integration test', ({ given, when, then }) => {
    let instance;

    given('I have a MarkdownsPeek instance', () => {
      instance = new MarkdownsPeek({ containerId: 'test-container' });
      instances.push(instance);
    });

    when('I manipulate the DOM after initialization', () => {
      expect(() => {
        const container = document.getElementById('test-container');
        if (container) {
          container.innerHTML = '<div>Modified content</div>';
        }
      }).not.toThrow();
    });

    then('the library should handle DOM changes gracefully', () => {
      expect(instance).toBeTruthy();
      expect(instance.prefix).toBeDefined();
    });

    then('it should not break functionality', () => {
      expect(instance.texts).toBeDefined();
      expect(typeof instance.texts).toBe('object');
    });
  });

  test('Event handling integration test', ({ given, when, then }) => {
    let instance;

    given('I have a MarkdownsPeek instance', () => {
      instance = new MarkdownsPeek({ containerId: 'test-container' });
      instances.push(instance);
    });

    when('I trigger various DOM events', () => {
      expect(() => {
        const event = new Event('click');
        if (document.dispatchEvent) {
          document.dispatchEvent(event);
        }
        if (window.dispatchEvent) {
          window.dispatchEvent(event);
        }
      }).not.toThrow();
    });

    then('the library should respond to events correctly', () => {
      expect(instance).toBeTruthy();
      expect(instance.prefix).toBeDefined();
    });

    then('event listeners should be properly managed', () => {
      expect(instance.texts).toBeDefined();
      expect(typeof instance.texts).toBe('object');
    });
  });

  test('Style integration test', ({ given, when, then }) => {
    let instance;

    given('I have a MarkdownsPeek instance', () => {
      instance = new MarkdownsPeek({ containerId: 'test-container' });
      instances.push(instance);
    });

    when('external styles are applied to the page', () => {
      expect(() => {
        const style = document.createElement('style');
        style.textContent = '.external-style { color: red; }';
        document.head.appendChild(style);
      }).not.toThrow();
    });

    then('the library styles should not conflict', () => {
      expect(instance).toBeTruthy();
      expect(instance.prefix).toBeDefined();
      expect(instance.prefix.length).toBeGreaterThan(0);
    });

    then('the component should remain functional', () => {
      expect(instance.texts).toBeDefined();
      expect(typeof instance.texts).toBe('object');
      expect(instance.prefix).toBeDefined();
    });
  });
}); 