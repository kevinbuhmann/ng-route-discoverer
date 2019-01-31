import * as ts from 'typescript';

import { getStringLiteralPropertyValue } from './ts.helpers';

describe('ts helpers', () => {
  describe('getStringLiteralPropertyValue', () => {
    it('should work', () => {
      const sourceFile = ts.createSourceFile('test.ts', `const foo = { prop: 'value', prop2: 'wrong-value' }`, ts.ScriptTarget.ES2018);
      const objectLiteralExpression = getObjectLiteralExpression(sourceFile);

      expect(getStringLiteralPropertyValue(objectLiteralExpression, 'prop')).toBe('value');
    });
  });
});

function getObjectLiteralExpression(sourceFile: ts.SourceFile) {
  let objectLiteralExpression: ts.ObjectLiteralExpression;

  ts.forEachChild(sourceFile, function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      return (objectLiteralExpression = node);
    } else {
      ts.forEachChild(node, visit);
    }
  });

  return objectLiteralExpression;
}
