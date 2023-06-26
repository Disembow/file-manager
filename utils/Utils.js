import { createReadStream, createWriteStream } from 'node:fs';
import { access, readdir, readFile, writeFile, rename, unlink } from 'node:fs/promises';
import path, { sep } from 'node:path';
import { EOL } from 'node:os';
const { createHash } = await import('node:crypto');
import zlib from 'node:zlib';

import { OperatingSystem } from './Os.js';
import { pipeline } from 'stream/promises';

export class Utils extends OperatingSystem {
  constructor() {
    super();
  }

  up = () => {
    let array;

    !this.currentDir ? (array = this.startDir.split(sep)) : (array = this.currentDir.split(sep));

    if (array.length === 1) {
      this.rl.write(`${this.currentDir}${sep}${EOL}`);
    } else {
      array.pop();
      this.currentDir = array.join(sep);
      this.rl.write(`${this.currentDir}${sep}${EOL}`);
    }
  };

  cd = async (command) => {
    if (command === 'cd') {
      return this.rl.write(`Command must include path: cd <path_to_file>${EOL}`);
    }

    const [_, newPath] = command.split(' ');

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

  ls = async () => {
    try {
      const dir = this.currentDir ? this.currentDir : this.startDir;
      const list = await readdir(dir, { withFileTypes: true });

      const result = list
        .map((file) => {
          return { Name: file.name, Type: file.isDirectory() ? 'directory' : 'file' };
        })
        .sort((a, b) => {
          if (a.Type === 'file' && b.Type === 'directory') {
            return 1;
          } else if (a.Type === 'directory' && b.Type === 'file') {
            return -1;
          } else {
            return a.Name.localeCompare(b.Name);
          }
        });

      console.table(result);
    } catch {
      this.rl.write(this.errorMessage);
    }
  };

  cat = async (pathCommand) => {
    try {
      const currPath = this.currentDir ? this.currentDir : this.startDir;
      const pathToFile = path.resolve(currPath, pathCommand);
      const rs = createReadStream(pathToFile, { encoding: 'utf8' });

      rs.on('open', () => console.log());
      rs.on('data', (chunk) => console.log(chunk));
      rs.on('error', () => console.log(`Couldn't find such file as ${path}`));
      rs.on('close', () => console.log(`Reading of ${pathCommand} finished${EOL}`));
    } catch (error) {
      this.rl.write(`Couldn't find such file as ${path}${EOL}`);
    }
  };

  add = async (fileName) => {
    const currPath = this.currentDir ? this.currentDir : this.startDir;
    const pathToFile = path.resolve(currPath, fileName);

    try {
      await writeFile(pathToFile, '');
      this.rl.write(`${fileName} has been created${EOL}`);
    } catch (error) {
      this.rl.write(`Error has been occured while creating file ${fileName}${EOL}`);
    }
  };

  rn = async (originalFileName, newFileName) => {
    if (!originalFileName || !newFileName) {
      return console.log('Wrong command, it needs 2 arguments');
    }

    const currPath = this.currentDir ? this.currentDir : this.startDir;
    const pathToFile = path.resolve(currPath, originalFileName);
    const pathToRenamedFile = path.resolve(currPath, newFileName);

    try {
      await access(pathToFile);
      await rename(pathToFile, pathToRenamedFile);
      console.log(`${originalFileName} renamed into ${newFileName}`);
    } catch (error) {
      console.log(`Couldn't find such file as ${originalFileName}`);
    }
  };

  cp = async (pathFrom, pathTo) => {
    const currPath = this.currentDir ? this.currentDir : this.startDir;
    const pathToCopyFrom = path.resolve(currPath, pathFrom);
    const pathToCopyTo = path.resolve(currPath, pathTo);

    const rs = createReadStream(pathToCopyFrom);
    const ws = createWriteStream(pathToCopyTo);
    let isWSOpen;
    isWSOpen = true;

    rs.on('error', () => {
      console.log(`File ${pathFrom} does not exist`);
      rs.close();
      ws.close();
      isWSOpen = false;
    });

    ws.on('error', () => {
      isWSOpen &&
        console.log(
          `Specified path to file ${pathTo} does not exist or the operation is not permitted`
        );
      rs.close();
      ws.close();
    });

    try {
      await pipeline(rs, ws);
      console.log(`Copying was successfully completed`);
    } catch (error) {
      await this.rm(pathToCopyTo, false);
    }
  };

  mv = async (pathFrom, pathTo) => {
    const fileName = path.resolve(pathFrom).split(sep).pop();
    const currPath = this.currentDir ? this.currentDir : this.startDir;
    const pathToNewDir = path.resolve(currPath, pathTo, fileName);

    await this.cp(pathFrom, pathToNewDir);
    await this.rm(pathFrom);
  };

  rm = async (enteredPath, mode = true) => {
    const currPath = this.currentDir ? this.currentDir : this.startDir;
    const resolevedPath = path.resolve(currPath, enteredPath);

    try {
      await unlink(resolevedPath);
      mode && console.log(`${resolevedPath} removed`);
    } catch {
      mode && console.log(`Can't find such file in ${resolevedPath}`);
    }
  };

  os = async (command) => {
    switch (command) {
      case 'os --EOL':
        this.os_eol();
        break;
      case 'os --cpus':
        this.os_cpus();
        break;
      case 'os --homedir':
        this.os_homedir();
        break;
      case 'os --username':
        this.os_username();
        break;
      case 'os --architecture':
        this.os_architecture();
        break;
      default:
        this.rl.write(this.errorMessage);
        break;
    }
  };

  hash = async (pathTo) => {
    const hash = createHash('sha256');
    const pathToFile = path.resolve(this.currentDir ? this.currentDir : this.startDir, pathTo);

    try {
      const result = await readFile(pathToFile, 'utf-8');
      hash.update(result);
      console.log(hash.digest('hex'));
    } catch {
      console.log('Wrong file path or file does not exist');
    }

    hash.end();
  };

  compress = async (pathFrom, pathTo) => {
    const currDir = this.currentDir ? this.currentDir : this.startDir;
    const fileName = path.resolve(pathFrom).split(sep).pop();
    const pathToCompressFrom = path.resolve(currDir, pathFrom);
    const pathToCompressTo = path.resolve(currDir, pathTo, fileName + '.br');

    const rs = createReadStream(pathToCompressFrom);
    const bs = zlib.createBrotliCompress();
    const ws = createWriteStream(pathToCompressTo);

    try {
      await pipeline(rs, bs, ws);
      console.log(`File compression successfully completed`);
    } catch {
      await this.rm(pathToCompressTo, false);
    }

    rs.on('error', (error) => {
      console.log(`File read error: ${error}`);
    });

    bs.on('error', (error) => {
      console.log(`Data compression error: ${error}`);
    });

    ws.on('error', (error) => {
      console.log(`File writing error: ${error}`);
    });
  };

  decompress = async (pathFrom, pathTo) => {
    const currDir = this.currentDir ? this.currentDir : this.startDir;
    const fileName = path.resolve(pathFrom).split(sep).pop().split('.');
    fileName.pop();
    const pathToDecompressFrom = path.resolve(currDir, pathFrom);
    const pathToDecompressTo = path.resolve(currDir, pathTo, fileName.join('.'));

    const rs = createReadStream(pathToDecompressFrom);
    const bs = zlib.createBrotliDecompress();
    const ws = createWriteStream(pathToDecompressTo);

    try {
      await pipeline(rs, bs, ws);
      console.log(`File decompression successfully completed`);
    } catch {
      await this.rm(pathToDecompressTo, false);
    }

    rs.on('error', (error) => {
      console.log(`File read error: ${error}`);
    });

    bs.on('error', (error) => {
      console.log(`Data decompression error: ${error}`);
    });

    ws.on('error', (error) => {
      console.log(`File writing error: ${error}`);
    });
  };
}
