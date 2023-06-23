import { argv, stdin, stdout } from 'process';
import readline from 'readline/promises';
import os, { homedir, EOL } from 'os';

export class Initial {
  constructor() {
    this.userNameArg = 'username';
    this.userName = this.getUserName();
    this.isWelcomeMsg = true;
    this.startDir = homedir();
    this.currentDir = null;
    this.errorMessage = `Operation failed, use command --help to see list of commands${EOL}`;

    this.rl = readline.createInterface({
      input: stdin,
      output: stdout,
    });
  }

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
