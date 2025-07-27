global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {}
};
global.document = {
  createElement: (tagName) => ({
    className: '',
    style: {
      position: '',
      left: '',
      visibility: '',
      pointerEvents: '',
      height: '',
      overflow: '',
      innerHTML: ''
    },
    querySelector: () => ({
      innerHTML: '',
      addEventListener: () => {},
      removeEventListener: () => {},
      classList: {
        toggle: () => {},
        remove: () => {},
        add: () => {}
      }
    }),
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {}
  }),
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: (id) => {
    if (id === 'test-container' || id === 'test-container-custom') {
      return {
        id: id,
        className: 'markdowns-peek',
        style: {
          height: '',
          overflow: '',
          innerHTML: ''
        },
        querySelector: () => ({
          innerHTML: '',
          addEventListener: () => {},
          removeEventListener: () => {},
          classList: {
            toggle: () => {},
            remove: () => {},
            add: () => {}
          }
        }),
        querySelectorAll: () => [],
        addEventListener: () => {},
        removeEventListener: () => {}
      };
    }
    return null;
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  readyState: 'complete',
  body: {
    appendChild: () => {},
    removeChild: () => {}
  },
  head: {
    appendChild: () => {}
  }
};
global.navigator = {};
global.HTMLElement = class {};
global.Element = class {};
global.Node = class {};
global.Event = class {};
global.CustomEvent = class {};
global.MouseEvent = class {};
global.fetch = () => Promise.resolve({});
global.getComputedStyle = () => ({
  display: 'flex'
}); 