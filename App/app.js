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
      const command = await this.rl.question('');

      switch (command) {
        case '--help':
          this.showCommandsList(commands);
          await this.askCommand();
          break;
        case 'up':
          this.up();
          await this.askCommand();
          break;
        case '.exit':
          this.farewellMsg();
          break;
        default:
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
