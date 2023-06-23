import { EOL } from 'os';

import { commands } from '../commands/commands.js';
import { Utils } from '../utils/Utils.js';

class App extends Utils {
  constructor() {
    super();
  }

  askCommand = async () => {
    if (this.isWelcomeMsg) {
      this.welcomeMsg();
      await this.askCommand();
    } else {
      const fullCommand = await this.rl.question('');
      const mainCommand = fullCommand.split(' ')[0];
      const pathCommand = fullCommand.split(' ')[1];
      const secondPathCommand = fullCommand.split(' ')[2];

      switch (mainCommand) {
        case '--help':
          this.showCommandsList(commands);
          await this.askCommand();
          break;
        case 'up':
          this.up();
          await this.askCommand();
          break;
        case 'cd':
          await this.cd(fullCommand);
          await this.askCommand();
          break;
        case 'ls':
          this.ls();
          await this.askCommand();
          break;
        case 'cat':
          await this.cat(pathCommand);
          await this.askCommand();
          break;
        case 'add':
          await this.add(pathCommand);
          await this.askCommand();
          break;
        case 'rn':
          this.rn();
          await this.askCommand();
          break;
        case 'cp':
          this.cp();
          await this.askCommand();
          break;
        case 'mv':
          this.mv();
          await this.askCommand();
          break;
        case 'rm':
          this.rm();
          await this.askCommand();
          break;
        case 'os':
          await this.os(fullCommand);
          await this.askCommand();
          break;
        case '.exit':
          this.farewellMsg();
          break;
        default:
          this.rl.write(this.errorMessage);
          await this.askCommand();
          break;
      }
    }
  };

  init = async () => {
    await this.askCommand();
  };
}

export default new App();
