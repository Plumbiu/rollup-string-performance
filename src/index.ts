import path from 'node:path'
import type { Plugin } from 'rollup'
import { findNodeAround } from 'acorn-walk'
import MagicString from 'magic-string'
import { createFilter } from '@rollup/pluginutils'

interface Options {
  includes?: string
  excludes?: string
}

export function stringOptimize(options?: Options): Plugin {
  const filter = createFilter(options?.includes, options?.excludes, {
    resolve: path.resolve('.'),
  })
  const MATCH_REGX = /.startsWith|.endsWith/g
  return {
    name: 'rollup-string-optimize',
    transform(code, id) {
      if (filter(id)) {
        return code
      }
      const magicstring = new MagicString(code)
      let m: RegExpExecArray | null = null
      const ast = this.parse(code)
      while ((m = MATCH_REGX.exec(code))) {
        const found = findNodeAround(ast, m.index, 'CallExpression')
          ?.node as any
        if (!found) {
          continue
        }
        const arg = found.arguments?.[0]
        const callee = found.callee
        if (!arg?.raw || arg.raw.includes('\\')) {
          continue
        }
        if (!callee || callee.optional) {
          continue
        }
        const param = arg.value ?? arg.name
        if (!param) {
          continue
        }
        const caller = code.slice(callee.object.start, callee.object.end)
        const paramLength = param.length
        let replacedString: string[] | string = []
        if (m[0] === '.endsWith') {
          for (let i = paramLength - 1; i >= 0; i--) {
            replacedString.push(
              `${caller}[${caller}.length-${i + 1}]==='${
                param[paramLength - i - 1]
              }'`,
            )
          }
        } else if (m[0] === '.startsWith') {
          for (let i = 0; i < paramLength; i++) {
            replacedString.push(`${caller}[${i}]==='${param[i]}'`)
          }
        } else {
          continue
        }
        replacedString = `(${replacedString.join('&&')})`
        console.log(
          `transfrom "${caller + m[0]}(${param})" to "${replacedString}"`,
        )
        magicstring.update(found.start, found.end, replacedString)
      }
      return magicstring.toString()
    },
  }
}
