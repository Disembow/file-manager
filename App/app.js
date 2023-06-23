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
      const command = (await this.rl.question('')).split(' ')[0];

      switch (command) {
        case '--help':
          this.showCommandsList(commands);
          await this.askCommand();
          break;
        case 'up':
          this.up();
          await this.askCommand();
          break;
        case 'cd':
          this.cd(command);
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

  init = () => {
    this.askCommand();
  };
}

export default new App();
