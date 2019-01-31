import { RouteTree } from './../ng-route-discoverer';

export function getPaths(routes: RouteTree[]) {
  const result: string[] = [];

  for (const route of routes) {
    getPathsInternal(route, [route.path]);
  }

  return result;

  function getPathsInternal(innerRoute: RouteTree, paths: string[]) {
    if (innerRoute.children && innerRoute.children.length) {
      for (const childRoute of innerRoute.children) {
        getPathsInternal(childRoute, paths.concat(childRoute.path));
      }
    } else {
      result.push(`/${paths.filter(path => !!path).join('/')}`);
    }
  }
}
