import { argv, stdin, stdout } from 'process';
import readline from 'readline/promises';
import { homedir } from 'os';
import { sep } from 'path';

export class Utils {
  constructor() {
    this.userNameArg = 'username';
    this.userName = this.getUserName();
    this.isWelcomeMsg = true;
    this.startDir = homedir();
    this.currentDir = null;

    this.rl = readline.createInterface({
      input: stdin,
      output: stdout,
    });
  }

  getUserName = () => {
    return argv.find((e) => e.includes(this.userNameArg)).split('=')[1];
  };

  showCommandsList = (commands) => {
    Object.entries(commands).map(([key, value]) => this.rl.write(`${key}: ${value}\n\n`));
  };

  welcomeMsg = () => {
    this.rl.write(`Welcome to the File Manager, ${this.userName}!\n`);
    this.rl.write(`You are currently in ${this.startDir}\n`);
    this.isWelcomeMsg = !this.isWelcomeMsg;
  };

  farewellMsg = () => {
    this.rl.write(`Thank you for using File Manager, ${this.userName}, goodbye!\n`);
    this.rl.close();
  };

  up = () => {
    let array;

    !this.currentDir ? (array = this.startDir.split(sep)) : (array = this.currentDir.split(sep));

    if (array.length === 1) {
      this.rl.write(`${this.currentDir}${sep}\n`);
    } else {
      array.pop();
      this.currentDir = array.join(sep);
      this.rl.write(`${this.currentDir}${sep}\n`);
    }
  };
}
