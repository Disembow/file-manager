import os, { EOL } from 'node:os';

import { Initial } from './Initial.js';

export class OperatingSystem extends Initial {
  constructor() {
    super();
  }

  os_eol = async () => {
    switch (os.platform()) {
      case 'win32':
        this.rl.write('\\n' + EOL);
        break;
      case 'linux':
        this.rl.write('\\r\\n' + EOL);
        break;
      case 'darwin':
        this.rl.write('\\r\\n' + EOL);
        break;
      default:
        this.rl.write('\\r\\n' + EOL);
        break;
    }
  };

  os_cpus = async () => {
    const cpus = os.cpus();
    const coresQty = cpus.length;

    this.rl.write(`Cores quantity: ${coresQty}${EOL}`);
    cpus.forEach((e, i) => {
      this.rl.write(
        `CPU #${i.toString().padStart(2, '0')}: model - ${e.model
          .split('@')[0]
          .trim()}, clock rate - ${(Number(e.speed) / 1000).toFixed(2)}GHz${
          i === coresQty - 1 ? `.` : `,`
        }${EOL}`
      );
    });
  };

  os_homedir = async () => this.rl.write(`Homedir: ${this.startDir}${EOL}`);

  os_username = async () => this.rl.write(`Username: ${os.userInfo().username}${EOL}`);

  os_architecture = async () => this.rl.write(`${os.arch()}${EOL}`);
}
