import * as path from 'path';
import * as ts from 'typescript';

import { createProgram } from './helpers/ts-program.helpers';
import { dereferenceIdentifier, getObjectLiteralElement, getStringLiteralPropertyValue } from './helpers/ts.helpers';
import { ProgramLanguageServiceHost } from './program-language-service-host';

export interface RouteTree {
  path: string;
  children?: RouteTree[];
}

export function getProjectRoutes(projectPath: string, routePathPropertyNames: string[] = ['path']) {
  const program = createProgram(projectPath);
  const languageServiceHost = new ProgramLanguageServiceHost(program);
  const languageService = ts.createLanguageService(languageServiceHost, ts.createDocumentRegistry());

  return getRoutes(getRootRoutesExpression(program), program, languageService, routePathPropertyNames);
}

function getRoutes(routesExpression: ts.Node, program: ts.Program, languageService: ts.LanguageService, routePathPropertyNames: string[]) {
  return getRoutesInternal(routesExpression);

  function getRoutesInternal(routeExpression: ts.Node) {
    routeExpression = dereferenceNode(routeExpression, program, languageService);

    let routes: RouteTree[];

    if (ts.isArrayLiteralExpression(routeExpression)) {
      routes = routeExpression.elements
        .map(routeExpressionElement => getRoutesInternal(routeExpressionElement))
        .reduce((acc, cur) => acc.concat(cur), []);
    } else if (ts.isObjectLiteralExpression(routeExpression)) {
      const routePath = getRoutePath(routeExpression, routePathPropertyNames);
      const childrenElement = getObjectLiteralElement(routeExpression, 'children');
      const loadChildren = getStringLiteralPropertyValue(routeExpression, 'loadChildren');

      const route: RouteTree = { path: routePath };

      if (childrenElement && ts.isPropertyAssignment(childrenElement)) {
        route.children = getRoutesInternal(childrenElement.initializer);
      } else if (loadChildren) {
        const lazyModulePath = loadChildren.split('#')[0];
        const absoluteLazyModulePath = `${path.resolve(program.getCompilerOptions().baseUrl, lazyModulePath)}.ts`;
        const lazyModuleSourceFile = program.getSourceFile(absoluteLazyModulePath);
        const lazyModulesRoutesExpression = getRoutesExpression(lazyModuleSourceFile, 'forChild');

        route.children = getRoutesInternal(lazyModulesRoutesExpression);
      }

      routes = [route];
    } else {
      const actualSyntaxKind = ts.SyntaxKind[routeExpression.kind];
      throw new Error(`Expected route expression to be an array literal or object literal. Got ${actualSyntaxKind} instead.`);
    }

    return routes;
  }
}

function dereferenceNode(node: ts.Node, program: ts.Program, languageService: ts.LanguageService) {
  if (ts.isIdentifier(node)) {
    return dereferenceIdentifier(node, program, languageService);
  } else if (ts.isSpreadElement(node)) {
    return ts.isIdentifier(node.expression) ? dereferenceIdentifier(node.expression, program, languageService) : node.expression;
  } else {
    return node;
  }
}

function getRoutePath(routeExpression: ts.ObjectLiteralExpression, routePathPropertyNames: string[]) {
  return routePathPropertyNames
    .map(routePathPropertyName => getStringLiteralPropertyValue(routeExpression, routePathPropertyName))
    .filter(value => value !== undefined)[0];
}

function getRootRoutesExpression(program: ts.Program) {
  let rootRoutesExpression: ts.Expression;

  for (const sourceFile of program.getSourceFiles()) {
    rootRoutesExpression = getRoutesExpression(sourceFile, 'forRoot');

    if (rootRoutesExpression) {
      break;
    }
  }

  if (rootRoutesExpression === undefined) {
    throw new Error('RouterModule.forRoot(...) was not found in the project.');
  }

  return rootRoutesExpression;
}

function getRoutesExpression(sourceFile: ts.SourceFile, routerModuleKind: 'forRoot' | 'forChild') {
  let routesExpression: ts.Expression;

  ts.forEachChild(sourceFile, function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText() === `RouterModule.${routerModuleKind}`) {
      return (routesExpression = node.arguments[0]);
    } else {
      ts.forEachChild(node, visit);
    }
  });

  return routesExpression;
}
