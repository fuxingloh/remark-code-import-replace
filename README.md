# Remark Code Import Replace

Remark code file import and optionally replace the code block.

### Basic usage

<pre lang="md">
```js import=code.js
```
</pre>

### With replace

<pre lang="md">
```js import=code.js render param
```
</pre>

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
