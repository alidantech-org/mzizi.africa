import { Glob } from "bun";
import { resolve } from "node:path";
import ts from "typescript-parser";

const root = resolve(import.meta.dir, "../contracts");
let invalid = false;
for await (const file of new Glob("**/*.ts").scan(root)) {
  const source = ts.createSourceFile(file, await Bun.file(resolve(root, file)).text(), ts.ScriptTarget.Latest, true);
  function visit(node: ts.Node): void {
    let specifier: ts.Node | undefined;
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      specifier = node.moduleSpecifier;
    } else if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === "require"))
    ) {
      specifier = node.arguments[0];
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
      specifier = node.argument.literal;
    }
    if (specifier && ts.isStringLiteralLike(specifier) && specifier.text.split("/").includes("..")) {
      const { line } = source.getLineAndCharacterOfPosition(specifier.getStart(source));
      console.error(`contracts/${file}:${line + 1}: use a #/ contract import for ${specifier.text}`);
      invalid = true;
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
if (invalid) process.exitCode = 1;
