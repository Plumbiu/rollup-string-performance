import { findNodeAround } from 'acorn-walk'
import MagicString from 'magic-string'

export function stringOptimize() {
  const MATCH_REGX = /.startsWith|.endsWith/g
  return {
    name: 'string-optimize',
    transform(code, id) {
      const magicstring = new MagicString(code)
      let m = null
      const ast = this.parse(code)
      while ((m = MATCH_REGX.exec(code))) {
        const found = findNodeAround(ast, m.index, 'CallExpression')?.node
        if (!found) {
          continue
        }
        const arg = found.arguments?.[0]
        const callee = found.callee
        let replacedString = []
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
          `transfrom "${caller + m[0]}(${
            arg.value ? `'${param}'` : param
          })" to "${replacedString}"`,
        )
        magicstring.update(found.start, found.end, replacedString)
      }
      return magicstring.toString()
    },
  }
}
