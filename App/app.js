import { commands } from '../commands/commands.js';
import { Utils } from '../utils/Utils.js';
import { EOL } from 'os';
import path from 'path';
import { access } from 'fs/promises';

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
          this.cat();
          await this.askCommand();
          break;
        case 'add':
          this.add();
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

  os = async (command) => {
    switch (command) {
      case 'os --EOL':
        this.os_eol();
        await this.askCommand();
        break;
      case 'os --cpus':
        this.os_cpus();
        await this.askCommand();
        break;
      case 'os --homedir':
        this.os_homedir();
        await this.askCommand();
        break;
      case 'os --username':
        this.os_username();
        await this.askCommand();
        break;
      case 'os --architecture':
        this.os_architecture();
        await this.askCommand();
        break;
      default:
        this.rl.write(this.errorMessage);
        await this.askCommand();
        break;
    }
  };

  init = async () => {
    await this.askCommand();
  };
}

export default new App();
