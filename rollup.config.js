import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload'
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';

import pkg from './package.json';

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

const name = 'relib';
const env = process.env.NODE_ENV || 'development';
const isDebug = env === 'development';

const config = {
  input: './src/index.ts',

  // https://rollupjs.org/guide/en#external-e-external
  external: [],

  plugins: [
    // Allows node_modules resolution
    resolve({extensions}),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Compile TypeScript/JavaScript files
    babel({extensions, include: ['src/**/*']}),

    replace({
      ENV: JSON.stringify(env),
      exclude: 'node_modules/**'
    }),

    json(),

    replace({
      ENV: JSON.stringify(env),
      exclude: 'node_modules/**'
    }),
  ],

  output: [
    {
      file: pkg.browser,
      format: 'umd',
      sourcemap: true,
      name: name,
      // https://rollupjs.org/guide/en#output-globals-g-globals
      globals: {
        jquery: 'jQuery'
      },
    }
  ]
};

if (isDebug) {
  config.plugins.push(
    serve({
      open: true,
      verbose: false,
      contentBase: ['dist'],
      historyApiFallback: true,
      host: '127.0.0.1',
      port: 3000
    }),
    livereload()
  );
} else {
  config.output.push({
    file: pkg.main,
    format: 'cjs',
    sourcemap: true
  },{
    file: pkg.module,
    format: 'es',
    sourcemap: true,
  });
}

export default config;
