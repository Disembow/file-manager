import { homedir } from 'os';
import { stdin, stdout } from 'process';
import readline from 'readline/promises';

import { getUserName } from '../utils/getUserName.js';
import { sendMessage } from '../utils/sendMessage.js';
import { showHelp } from '../utils/showHelp.js';
import { commands } from '../commands/commands.js';

class App {
  constructor() {
    this.userName = getUserName();
    this.startDir = homedir();
    this.currentDir = '';
    this.isWelcomeMsg = true;
    this.rl = readline.createInterface({
      input: stdin,
      output: stdout,
    });
  }

  changeCurrentDir = (path) => {
    this.currentDir = path;
  };

  welcomeMsg() {
    this.rl.write(`Welcome to the File Manager, ${this.userName}!\n`);
    this.rl.write(`You are currently in ${this.startDir}\n`);
    this.isWelcomeMsg = !this.isWelcomeMsg;
  }

  askCommand = async () => {
    if (this.isWelcomeMsg) {
      this.welcomeMsg();
      await this.askCommand();
    } else {
      const command = await this.rl.question('');

      if (command === '.exit') {
        this.rl.write(`Thank you for using File Manager, ${this.userName}, goodbye!\n`);
        this.rl.close();
      } else {
        await this.askCommand();
      }
    }
  };

  init = () => {
    this.askCommand();
  };
}

export default new App();
