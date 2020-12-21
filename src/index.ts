import path from "path";
import fs from "fs";

import {reduce} from 'lodash';
import u from "unist-builder";
import visit from "unist-util-visit";
import {Transformer} from 'unified';
import {Code, Parent} from 'mdast';

interface ReplaceFunction {
  (node: Code, meta: CodeMeta, opt: { u: any }): [any];
}

interface Options {
  baseDir?: String;
  replace?: ReplaceFunction;
}

interface CodeMeta {
  import: string;

  [key: string]: string | boolean;
}

function importCode({baseDir, replace}: Options): Transformer {
  return function transformer(tree, file) {
    function visitor(node: Code, index: number, parent: Parent): void {
      const parts: string[][] = node.meta?.split(' ')
        .map(part => part.split('=')) || []

      // @ts-ignore
      const meta: CodeMeta = reduce(parts, (meta: CodeMeta, [key, value]: [string, string]) => {
        meta[key] = value || true
        return meta;
      }, {lang: node.lang});

      if (meta.import) {
        meta.file = path.join('./', `${baseDir ?? ''}`, meta.import)
        meta.path = path.join(file.cwd, './', `${baseDir ?? ''}`, meta.import)
        node.value = fs.readFileSync(meta.path, 'utf-8').trim()

        if (replace) {
          const div = u('div', replace(node, meta, {u}))
          if (div) {
            // @ts-ignore
            parent.children.splice(index, 1, div);
          }
        }
      }
    }

    // @ts-ignore
    visit(tree, 'code', visitor);
  };
}

module.exports = importCode;
