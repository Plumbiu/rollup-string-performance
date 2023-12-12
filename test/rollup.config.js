import commonjs from '@rollup/plugin-commonjs'
import { stringOptimize } from '../src/index.js'

export default {
  input: 'test/index.js',
  output: {
    dir: './test/dist',
    format: 'es',
  },
  plugins: [commonjs(), stringOptimize()],
}
