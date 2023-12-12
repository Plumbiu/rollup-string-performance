# rollup-string-performance

> transfrom startsWith and endsWith to one char compare.

```js
const str = 'hello world'
str.startsWith('he')
str.endssWith('ld')
```

will transfrom:

```js
const str = 'hello world'
(str[0] === 'h' && str[1] === 'e')
(str[str.length - 2] === 'l' && str[str.length - 1] === 'e')
```

# Install

```bash
npm i rollup-string-performance -D
```

# Usage

In `rollup.config.js`:

```js
import { stringOptimize } from 'rollup-string-performance'

export default {
  // ...
  plugin: [stringOptimize()],
}
```

# Note

String that include `'\\'` will ignore, like `\t`, `\n`.

Only `Literal` or `Identifier` arguments node can be regonized, other node will be ignored, like:

```ts
const fn = (str: string) => str

const str = 'hello world'

str.startsWith(fn('he')) // will ignore
```

you cant rewirte to:

```ts
const fn = (str: string) => str

const str = 'hello world'

const perfix = fn('he')
str.startsWith(perfix) // will work
```
