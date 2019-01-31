import { execute } from './helpers/shell.helpers';
import { parseFlags } from './helpers/utility.helpers';

interface Options {
  unit: boolean;
  e2e: boolean;
}

const defaultOptionsFn = (args: Options) => ({
  unit: !args.e2e,
  e2e: !args.unit
});

const options = parseFlags(process.argv.slice(2), defaultOptionsFn);

(async () => {
  await execute('rimraf ./dist-spec ./coverage');
  await execute(`tsc --project ./tsconfig.spec.json`);

  if (options.unit) {
    await unitTest();
  }

  if (options.e2e) {
    await e2eTest();
  }

  await execute('istanbul report -t lcov');
  await execute('istanbul report -t text-summary');
  await execute('istanbul check-coverage --statements 90 --branches 90 --functions 90 --lines 90');
})();

async function unitTest() {
  await execute(getTestCommand('unit', './node_modules/jasmine/bin/jasmine.js', '--config=jasmine.json'));
  await execute(getRemapCoverageCommand('unit'));
}

async function e2eTest() {
  await execute('ncp ./package.json ./dist-spec/package.json');
  await execute(getTestCommand('e2e', './dist-spec/src/ng-route-discoverer-cli.js', 'TEST ARGS HERE'));
  await execute(getRemapCoverageCommand('e2e'));
  // verify that the e2e test did what you except
}

function getTestCommand(testSet: string, script: string, args: string) {
  return `istanbul cover ${script} --dir ./coverage/${testSet} --print none -- ${args}`;
}

function getRemapCoverageCommand(testSet: string) {
  return `remap-istanbul -i ./coverage/${testSet}/coverage.json -o ./coverage/${testSet}/coverage.json -t json`;
}
