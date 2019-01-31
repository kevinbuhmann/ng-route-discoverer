import * as fs from 'fs';

export function readFile(filePath: string) {
  return fs.readFileSync(filePath).toString();
}

export function readJsonFile(filePath: string) {
  return JSON.parse(readFile(filePath));
}
