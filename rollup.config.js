
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
  // UMD build (for browsers)
  {
    input: 'src/markdowns-peek.js',
    output: {
      name: 'MarkdownsPeek',
      file: 'dist/markdowns-peek.js',
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs()
    ]
  },
  
  // Minified UMD build
  {
    input: 'src/markdowns-peek.js',
    output: {
      name: 'MarkdownsPeek',
      file: 'dist/markdowns-peek.min.js',
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      production && terser()
    ]
  },
  
  // ES Module build
  {
    input: 'src/markdowns-peek.js',
    output: {
      file: 'dist/markdowns-peek.esm.js',
      format: 'es',
      sourcemap: true
    },
    external: ['marked', 'dompurify'],
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      })
    ]
  }
];