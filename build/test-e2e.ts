import chalk from 'chalk';

import { readJsonFile } from './helpers/fs.helpers';
import { execute } from './helpers/shell.helpers';
import { getRemapCoverageCommand, getTestCommand } from './helpers/test.helpers';

(async () => {
  await execute('ncp ./package.json ./dist-spec/package.json');

  await e2eTestProjects();
  await e2eTestNoProjectOption();
})();

async function e2eTestProjects() {
  const testCases: { testName: string; args: string; expectedPaths: string[] }[] = [
    {
      testName: 'comprehensive',
      args: '--project ./spec/success-cases/comprehensive/tsconfig.json',
      expectedPaths: readJsonFile('./spec/success-cases/comprehensive/expected-paths.json')
    },
    {
      testName: 'comprehensive-with-route-paths-option',
      args: '--project ./spec/success-cases/comprehensive/tsconfig.json --route-path-property-names path',
      expectedPaths: readJsonFile('./spec/success-cases/comprehensive/expected-paths.json')
    }
  ];

  for (const { testName, args, expectedPaths } of testCases) {
    const testSet = `e2e-${testName}`;
    const result = await execute(getTestCommand(testSet, './dist-spec/src/ng-route-discoverer-cli.js', args), { stdio: undefined });

    if (result.stdout.trim() !== expectedPaths.join('\n')) {
      console.log(chalk.red('CLI did not output the expected paths.'));
      process.exit(1);
    }

    await execute(getRemapCoverageCommand(testSet));
  }
}

async function e2eTestNoProjectOption() {
  const testSet = 'e2e-no-project-option';

  const args = '';
  const result = await execute(getTestCommand(testSet, './dist-spec/src/ng-route-discoverer-cli.js', args), { stdio: undefined }, false);

  if (result.code !== 1) {
    console.log(chalk.red('CLI did not exit with code 1 when invoked with no project option.'));
    process.exit(1);
  }

  if (result.stderr !== 'Error: The "--project ./path/to/tsconfig.json" option is required.\n') {
    console.log(chalk.red('CLI did not output the expected missing project option error message.'));
    process.exit(1);
  }

  await execute(getRemapCoverageCommand(testSet));
}
