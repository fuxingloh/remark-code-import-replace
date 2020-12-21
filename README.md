# Remark Code Import Replace [![remark-code-import-replace](https://img.shields.io/npm/v/remark-code-import-replace.svg)](https://www.npmjs.com/package/remark-code-import-replace)

![CI](https://github.com/fuxingloh/remark-code-import-replace/workflows/CI/badge.svg)
[![License MIT](https://img.shields.io/github/license/fuxingloh/remark-code-import-replace)](https://github.com/fuxingloh/vue-horizontal/blob/main/LICENSE)

Remark code file import and optionally replace the code block.

## Basic usage

<pre lang="md">
```js import=code.js
```
</pre>


## Code import and replace node

> `replace` will only run if `import=` is set.

<pre lang="md">
```js import=code.js render param
```
</pre>

### Remark options
```js
export default {
  remark: ['remark-code-import-replace', {
    // optionally override baseDir
    baseDir: '/snippets',
    replace: (node, meta, {u}) => {
      // Access any meta declared in codeblock
      if (meta.param) {
        return [node]
      }

      // e.g. to wraped into another component
      if (meta.render) {
        return [
          u('html', {value: `<div>`}),
          node,
          u('html', {value: `</div>`}),
        ]
      }
    },
  }]
}
```

## Using with Nuxt Content and Components

- Code file import
- Register a new directory for global import 
- Replace and add a new node with the name of the component

```js
// nuxt.config.js
export default {
  content: {
    markdown: {
      remarkPlugins: [
        ['remark-code-import-replace', {
          replace: (node, meta, {u}) => {
            return [
              u('html', {value: `<${meta.file.name}>`}),
              u('html', {value: `</${meta.file.name}>`}),
              node,
            ]
          }
        }]
      ],
    },
  },
  hooks: {
    'components:dirs': async (dirs) => {
      dirs.push({
        path: "~/content",
        global: true
      })
    }
  }
}
```
