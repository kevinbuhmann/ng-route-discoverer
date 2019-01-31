# ng-route-discoverer

[![Build Status](https://api.travis-ci.org/kevinphelps/ng-route-discoverer.svg?branch=master)](https://travis-ci.org/kevinphelps/ng-route-discoverer)
[![codecov](https://codecov.io/gh/kevinphelps/ng-route-discoverer/branch/master/graph/badge.svg)](https://codecov.io/gh/kevinphelps/ng-route-discoverer)
[![npm version](https://badge.fury.io/js/ng-route-discoverer.svg)](https://www.npmjs.com/package/ng-route-discoverer)

`ng-route-discoverer` traverses an Angular project and discovers all routes, including lazy routes (`loadChildren`).

## Installation

`npm install --save-dev ng-route-discoverer` or `yarn add --dev ng-route-discoverer`

## Usage

### CLI

`ng-route-discoverer --project ./path/to/tsconfig.app.json`

Sample output:

```
/
/app-shell
/errors/not-found
/errors/internal-server-error
/feature
/feature/feature-page
/**
```

### API

```typescript
import { getPaths, getProjectRoutes } from 'ng-route-discoverer';

const routes = getProjectRoutes('./src/tsconfig.app.json'); // tree
const paths = getPaths(routes);
```
