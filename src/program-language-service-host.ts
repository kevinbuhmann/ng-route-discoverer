import * as ts from 'typescript';

interface ScriptSnapshots {
  [fileName: string]: ts.IScriptSnapshot;
}

export class ProgramLanguageServiceHost implements ts.LanguageServiceHost {
  private readonly scriptSnapshots: ScriptSnapshots = {};

  constructor(private readonly program: ts.Program) {
    const reduceFn = (snapshots: ScriptSnapshots, sourceFile: ts.SourceFile) => {
      snapshots[sourceFile.fileName] = ts.ScriptSnapshot.fromString(sourceFile.text);
      return snapshots;
    };

    this.scriptSnapshots = program.getSourceFiles().reduce(reduceFn, {});
  }

  getCompilationSettings() {
    return this.program.getCompilerOptions();
  }

  getCurrentDirectory() {
    return '';
  }

  getDefaultLibFileName(_options: ts.CompilerOptions) {
    return 'lib;';
  }

  getScriptFileNames() {
    return Object.keys(this.scriptSnapshots);
  }

  getScriptSnapshot(fileName: string) {
    return this.scriptSnapshots[fileName];
  }

  getScriptVersion(_fileName: string) {
    return '1';
  }
}
