import * as fs from 'fs';

import { getPaths, getProjectRoutes } from '.';
import { readFile, readJsonFile } from './../build/helpers/fs.helpers';

describe('ng-route-discoverer', () => {
  const successCases = fs.readdirSync('./spec/success-cases');
  const failureCases = fs.readdirSync('./spec/failure-cases');

  describe('getAllRoutes', () => {
    for (const successCase of successCases) {
      describe(successCase, () => {
        it('should return the correct test project routes', () => {
          const projectPath = `./spec/success-cases/${successCase}/tsconfig.json`;
          const expectedRoutes = readJsonFile(`./spec/success-cases/${successCase}/expected-routes.json`);

          expect(getProjectRoutes(projectPath)).toEqual(expectedRoutes);
        });
      });
    }

    for (const failureCase of failureCases) {
      describe(failureCase, () => {
        it('should throw the expected error', () => {
          const projectPath = `./spec/failure-cases/${failureCase}/tsconfig.json`;
          const expectedErrorMessage = readFile(`./spec/failure-cases/${failureCase}/expected-error-message.txt`).trim();

          expect(() => getProjectRoutes(projectPath)).toThrowError(expectedErrorMessage);
        });
      });
    }
  });

  describe('getPaths', () => {
    for (const successCase of successCases) {
      describe(successCase, () => {
        it('should return the correct test project paths', () => {
          const routes = readJsonFile(`./spec/success-cases/${successCase}/expected-routes.json`);

          const expectedPaths = readJsonFile(`./spec/success-cases/${successCase}/expected-paths.json`);
          expect(getPaths(routes)).toEqual(expectedPaths);
        });
      });
    }
  });
});
