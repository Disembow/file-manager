import { stdin, stdout } from 'process';
import { pipeline } from 'stream/promises';

import { getUserName } from '../utils/getUserName.js';
import { sendMessage } from '../utils/sendMessage.js';
import { showHelp } from '../utils/showHelp.js';
import { commands } from '../commands/commands.js';

class App {
  constructor() {
    this.userName = getUserName();
    this.startDir = process.cwd();
    this.currentDir = '';
  }

  changeCurrentDir(path) {
    this.currentDir = path;
  }

  init() {
    console.clear();
    sendMessage(`Welcome to the File Manager, ${this.userName}!`);
    sendMessage(`You are currently in ${this.startDir}`);
    showHelp(commands);

    pipeline(stdin, stdout);
  }
}

export default new App();
