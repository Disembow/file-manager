import { AskCommand } from '../modules/AskCommand.js';

class App extends AskCommand {
  constructor() {
    super();
  }

  init = async () => {
    await this.askCommand();
  };
}

export default new App();
