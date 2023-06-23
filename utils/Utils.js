import { access, readdir } from 'fs/promises';
import { EOL } from 'os';
import { sep } from 'path';
import { OperatingSystem } from './Os.js';
import path from 'path';

export class Utils extends OperatingSystem {
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

  cd = async (command) => {
    if (command === 'cd') {
      return this.rl.write(`Command must include path: cd <path_to_file>${EOL}`);
    }

    const [_, newPath] = command.replace(/ +/g, ' ').trim().split(' ');

    try {
      let targetDir;
      this.currentDir ? (targetDir = this.currentDir) : (targetDir = this.startDir);
      targetDir = path.resolve(targetDir, newPath);

      await access(targetDir);

      this.currentDir = targetDir;
      this.rl.write(`You're currently in ${this.currentDir}${EOL}`);
    } catch (error) {
      this.rl.write(`Specified path does not exist${EOL}`);
    }
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

  os = async (command) => {
    switch (command) {
      case 'os --EOL':
        this.os_eol();
        break;
      case 'os --cpus':
        this.os_cpus();
        break;
      case 'os --homedir':
        this.os_homedir();
        break;
      case 'os --username':
        this.os_username();
        break;
      case 'os --architecture':
        this.os_architecture();
        break;
      default:
        this.rl.write(this.errorMessage);
        break;
    }
  };
}
