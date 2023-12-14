import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: {
    dir: './dist',
    format: 'es',
  },
  plugins: [commonjs(), typescript()],
}
