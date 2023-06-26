import { argv, stdin, stdout } from 'node:process';
import { EOL, homedir } from 'node:os';
import readline from 'node:readline/promises';

export class Initial {
  constructor() {
    this.userNameArg = 'username';
    this.userName = this.getUserName();
    this.isWelcomeMsg = true;
    this.startDir = homedir();
    this.currentDir = this.startDir;
    this.errorMessage = `Operation failed, use command --help to see list of commands${EOL}`;

    this.rl = readline.createInterface({
      input: stdin,
      output: stdout,
    });
    this.rl.on('SIGINT', this.farewellMsg);
  }

  getUserName = () => {
    return argv.find((e) => e.includes(this.userNameArg)).split('=')[1];
  };

  showCommandsList = (commands) => {
    Object.entries(commands).map(([key, value]) => this.rl.write(`${key}: ${value}${EOL}`));
  };

  welcomeMsg = () => {
    this.rl.write(`Welcome to the File Manager, ${this.userName}!${EOL}`);
    this.rl.write(`You are currently in ${this.startDir}${EOL}`);
    this.isWelcomeMsg = !this.isWelcomeMsg;
  };

  farewellMsg = () => {
    console.log(`Thank you for using File Manager, ${this.userName}, goodbye!`);
    this.rl.close();
  };
}
