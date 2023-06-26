import { access } from 'node:fs/promises';
import path, { sep } from 'node:path';
import { EOL } from 'node:os';

import { OperatingSystem } from './Os.js';

export class Navigation extends OperatingSystem {
  constructor() {
    super();
  }

  up = () => {
    let array;

    !this.currentDir ? (array = this.startDir.split(sep)) : (array = this.currentDir.split(sep));

    if (array.length === 1) {
      return;
    } else {
      array.pop();
      this.currentDir = array.join(sep);
    }
  };

  cd = async (command) => {
    if (command === 'cd') {
      return this.rl.write(`Command must include path: cd <path_to_file>${EOL}`);
    }

    const [_, newPath] = command.split(' ');

    try {
      let targetDir;
      this.currentDir ? (targetDir = this.currentDir) : (targetDir = this.startDir);
      targetDir = path.resolve(targetDir, newPath);

      await access(targetDir);

      this.currentDir = targetDir;
      // this.rl.write(`You're currently in ${this.currentDir}${EOL}`);
    } catch (error) {
      this.rl.write(`Specified path does not exist${EOL}`);
    }
  };
}
