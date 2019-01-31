import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

export function createProgram(configFilePath: string): ts.Program {
  const config = ts.readConfigFile(configFilePath, ts.sys.readFile.bind(ts.sys));

  if (config.error !== undefined) {
    const errorMessage = ts.formatDiagnostics([config.error], {
      getCanonicalFileName: filename => filename,
      getCurrentDirectory: process.cwd.bind(process),
      getNewLine: () => '\n'
    });

    throw new Error(errorMessage.trim());
  }

  const parseConfigHost: ts.ParseConfigHost = {
    fileExists: fs.existsSync,
    readDirectory: ts.sys.readDirectory.bind(ts.sys),
    readFile: ts.sys.readFile.bind(ts.sys),
    useCaseSensitiveFileNames: true
  };
  const basePath = path.resolve(path.dirname(configFilePath));
  const parsedConfig = ts.parseJsonConfigFileContent(config.config, parseConfigHost, basePath, { noEmit: true });

  if (parsedConfig.errors !== undefined && parsedConfig.errors.length > 1) {
    const errorMessage = ts.formatDiagnostics(parsedConfig.errors, {
      getCanonicalFileName: filename => filename,
      getCurrentDirectory: process.cwd.bind(process),
      getNewLine: () => '\n'
    });

    throw new Error(errorMessage.trim());
  }

  const host = ts.createCompilerHost(parsedConfig.options, true);
  return ts.createProgram(parsedConfig.fileNames, parsedConfig.options, host);
}
