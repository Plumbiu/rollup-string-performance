import type { Plugin } from 'rollup'

interface Options {
  includes?: string
  excludes?: string
}

declare function stringOptimize(options: Options): Plugin
