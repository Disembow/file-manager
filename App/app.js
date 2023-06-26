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
      const trimmedCommand = fullCommand.replace(/ +/g, ' ').trim();
      const [mainCommand, pathCommand, secondPathCommand] = trimmedCommand.split(' ');

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
          await this.cd(trimmedCommand);
          await this.askCommand();
          break;
        case 'ls':
          await this.ls();
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
          await this.rn(pathCommand, secondPathCommand);
          await this.askCommand();
          break;
        case 'cp':
          await this.cp(pathCommand, secondPathCommand);
          await this.askCommand();
          break;
        case 'mv':
          await this.mv(pathCommand, secondPathCommand);
          await this.askCommand();
          break;
        case 'rm':
          await this.rm(pathCommand);
          await this.askCommand();
          break;
        case 'os':
          await this.os(trimmedCommand);
          await this.askCommand();
          break;
        case 'hash':
          await this.hash(pathCommand);
          await this.askCommand();
          break;
        case 'compress':
          await this.compress(pathCommand);
          await this.askCommand();
          break;
        case 'decompress':
          await this.decompress(pathCommand);
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
