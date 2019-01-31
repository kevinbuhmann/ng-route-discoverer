#! /usr/bin/env node
import chalk from 'chalk';
import * as yargs from 'yargs';

import { getPaths } from './helpers/tree.helpers';
import { getProjectRoutes } from './ng-route-discoverer';

interface Options {
  project: string;
  routePathPropertyNames: string;
}

try {
  const version = require('./../package.json').version;

  yargs.version(version);
  const options: Options = yargs.argv as any;

  if (!options.project) {
    throw new Error('The "--project ./path/to/tsconfig.json" option is required.');
  }

  const routePathPropertyNames = options.routePathPropertyNames ? options.routePathPropertyNames.split(',') : ['path'];

  const routes = getProjectRoutes(options.project, routePathPropertyNames);
  const routePaths = getPaths(routes);

  console.log(routePaths.join('\n'));
} catch (error) {
  console.error(chalk.red(`${error}`));
  process.exit(1);
}
