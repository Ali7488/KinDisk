import { existsSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";

// Node ESM needs explicit extensions on relative imports. Only autofix when
// the matching .js file exists, so directory and non-JavaScript imports stay intact.
export const explicitJsExtensionRule = {
  meta: {
    type: "problem",
    fixable: "code",
    schema: [],
    messages: {
      missing: 'Relative import "{{specifier}}" needs an explicit .js extension.',
    },
  },
  create(context) {
    function check(source) {
      const specifier = source?.value;
      if (
        typeof specifier !== "string" ||
        (!specifier.startsWith("./") && !specifier.startsWith("../")) ||
        extname(specifier)
      ) {
        return;
      }

      if (!existsSync(resolve(dirname(context.filename), `${specifier}.js`))) return;

      context.report({
        node: source,
        messageId: "missing",
        data: { specifier },
        fix(fixer) {
          return fixer.replaceText(source, JSON.stringify(`${specifier}.js`));
        },
      });
    }

    return {
      ImportDeclaration(node) {
        check(node.source);
      },
      ExportNamedDeclaration(node) {
        check(node.source);
      },
      ExportAllDeclaration(node) {
        check(node.source);
      },
      ImportExpression(node) {
        check(node.source);
      },
    };
  },
};
