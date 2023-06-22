import { readdir } from 'fs/promises';
import { argv, stdin, stdout } from 'process';
import readline from 'readline/promises';
import os, { homedir, EOL } from 'os';
import { sep } from 'path';

export class Utils {
  constructor() {
    this.userNameArg = 'username';
    this.userName = this.getUserName();
    this.isWelcomeMsg = true;
    this.startDir = homedir();
    this.currentDir = null;
    this.errorMessage = 'Operation failed, use command --help to see list of commands';

    this.rl = readline.createInterface({
      input: stdin,
      output: stdout,
    });
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

  os_eol = async () => {
    switch (os.platform()) {
      case 'win32':
        this.rl.write('\\n' + os.EOL);
        break;
      case 'linux':
        this.rl.write('\\r\\n' + os.EOL);
        break;
      case 'darwin':
        this.rl.write('\\r\\n' + os.EOL);
        break;
      default:
        this.rl.write('\\r\\n' + os.EOL);
        break;
    }
  };

  os_cpus = async () => {
    const cpus = os.cpus();
    const coresQty = cpus.length;

    this.rl.write(`Cores quantity: ${coresQty}${EOL}`);
    cpus.forEach((e, i) => {
      this.rl.write(
        `CPU #${i.toString().padStart(2, '0')}: model - ${e.model
          .split('@')[0]
          .trim()}, clock rate - ${(Number(e.speed) / 1000).toFixed(2)}GHz${
          i === coresQty - 1 ? `.` : `,`
        }${EOL}`
      );
    });
  };

  os_homedir = async () => {};

  os_username = async () => {};

  os_architecture = async () => {};

  getUserName = () => {
    return argv.find((e) => e.includes(this.userNameArg)).split('=')[1];
  };

  showCommandsList = (commands) => {
    Object.entries(commands).map(([key, value]) => this.rl.write(`${key}: ${value}${os.EOL}`));
  };

  welcomeMsg = () => {
    this.rl.write(`Welcome to the File Manager, ${this.userName}!${EOL}`);
    this.rl.write(`You are currently in ${this.startDir}${EOL}`);
    this.isWelcomeMsg = !this.isWelcomeMsg;
  };

  farewellMsg = () => {
    this.rl.write(`Thank you for using File Manager, ${this.userName}, goodbye!${EOL}`);
    this.rl.close();
  };
}
