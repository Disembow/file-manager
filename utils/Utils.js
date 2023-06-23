import { readdir } from 'fs/promises';
import { EOL } from 'os';
import { sep } from 'path';
import { OperatingSystemClass } from './Os.js';

export class Utils extends OperatingSystemClass {
  constructor() {
    super();
  }

  up = () => {
    let array;

    !this.currentDir ? (array = this.startDir.split(sep)) : (array = this.currentDir.split(sep));

    if (array.length === 1) {
      this.rl.write(`${this.currentDir}${sep}${EOL}`);
    } else {
      array.pop();
      this.currentDir = array.join(sep);
      this.rl.write(`${this.currentDir}${sep}${EOL}`);
    }
  };

  cd = (command) => {
    this.rl.write(`${command} ++++`);
  };

  ls = async () => {
    try {
      const dir = this.currentDir ? this.currentDir : this.startDir;
      const list = await readdir(dir, { withFileTypes: true });

      const result = list
        .map((file) => {
          return { Name: file.name, Type: file.isDirectory() ? 'directory' : 'file' };
        })
        .sort((a, b) => {
          if (a.Type === 'file' && b.Type === 'directory') {
            return 1;
          } else if (a.Type === 'directory' && b.Type === 'file') {
            return -1;
          } else {
            return a.Name.localeCompare(b.Name);
          }
        });

      console.table(result);
    } catch {
      this.rl.write(this.errorMessage);
    }
  };

  cat = async () => {};

  add = async () => {};

  rn = async () => {};

  cp = async () => {};

  mv = async () => {};

  rm = async () => {};
}
