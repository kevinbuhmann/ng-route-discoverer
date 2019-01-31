import * as ts from 'typescript';

export function dereferenceIdentifier(node: ts.Identifier, program: ts.Program, languageService: ts.LanguageService) {
  const definition = getDefinition(node, program, languageService);
  const definitionSourceFile = definition ? program.getSourceFile(definition.fileName) : undefined;
  const identifier = definition ? (ts as any).getTouchingToken(definitionSourceFile, definition.textSpan.start) : undefined;

  if (
    identifier &&
    ts.isIdentifier(identifier) &&
    identifier.parent &&
    ts.isVariableDeclaration(identifier.parent) &&
    identifier.parent.initializer &&
    isLiteral(identifier.parent.initializer)
  ) {
    return identifier.parent.initializer;
  } else {
    throw new Error(`Cannot resolve indenfier "${node.text}".`);
  }
}

export function getObjectLiteralElement(node: ts.ObjectLiteralExpression, propertyName: string) {
  return node.properties
    .filter(property => property.name !== undefined)
    .find(property => (ts.isStringLiteral(property.name) || ts.isIdentifier(property.name)) && property.name.text === propertyName);
}

export function getStringLiteralPropertyValue(objectLiteralExpression: ts.ObjectLiteralExpression, propertyName: string) {
  const pathElementElement = getObjectLiteralElement(objectLiteralExpression, propertyName);

  if (pathElementElement && ts.isPropertyAssignment(pathElementElement) && ts.isStringLiteral(pathElementElement.initializer)) {
    return pathElementElement.initializer.text;
  }
}

function isLiteral(node: ts.Node) {
  return (
    ts.isNumericLiteral(node) ||
    ts.isStringLiteral(node) ||
    ts.isRegularExpressionLiteral(node) ||
    ts.isNoSubstitutionTemplateLiteral(node) ||
    ts.isArrayLiteralExpression(node) ||
    ts.isObjectLiteralExpression(node)
  );
}

function getDefinition(node: ts.Node, program: ts.Program, languageService: ts.LanguageService) {
  const sourceFile = node.getSourceFile();
  const sourceFiles = program.getSourceFiles();

  const referencedSymbols = languageService.findReferences(sourceFile.fileName, node.getStart());

  let definition: ts.ReferenceEntry;

  if (referencedSymbols) {
    const isInImportDeclaration = (reference: ts.ReferenceEntry) => {
      const referenceSourceFile = sourceFiles.find(sf => sf.fileName === reference.fileName);

      return (
        getParentOfType((ts as any).getTouchingToken(referenceSourceFile, reference.textSpan.start), ts.isImportDeclaration) !== undefined
      );
    };

    definition = referencedSymbols
      .map(referencedSymbol => referencedSymbol.references)
      .reduce((flat, current) => flat.concat(current), [])
      .filter(reference => reference.isDefinition && !isInImportDeclaration(reference))[0];
  }

  return definition;
}

function getParentOfType<T extends ts.Node>(node: ts.Node, predicate: (n: ts.Node) => n is T) {
  return getMatchingParent(node, predicate) as T;
}

function getMatchingParent(node: ts.Node, predicate: (n: ts.Node) => boolean) {
  let parent = node.parent;

  while (parent && !predicate(parent)) {
    parent = parent.parent;
  }

  return parent;
}
