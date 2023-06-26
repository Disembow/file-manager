import { createReadStream, createWriteStream } from 'node:fs';
import { access, readdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import path, { sep } from 'node:path';
import { EOL } from 'node:os';
const { createHash } = await import('node:crypto');
import zlib from 'node:zlib';

import { Navigation } from './Navigation.js';

export class Utils extends Navigation {
  constructor() {
    super();
  }

  ls = async () => {
    try {
      const list = await readdir(this.currentDir, { withFileTypes: true });

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
      const pathToFile = path.resolve(this.currentDir, pathCommand);
      const rs = createReadStream(pathToFile, { encoding: 'utf8' });

      rs.on('data', (chunk) => console.log(chunk));
      rs.on('error', () => console.log(`Couldn't find such file as ${path}`));
      rs.on('close', () => {
        console.log(`Reading of ${pathCommand} finished`);
        console.log(`You are currently in ${this.currentDir}`);
      });
    } catch (error) {
      this.rl.write(`Couldn't find such file as ${path}${EOL}`);
    }
  };

  add = async (fileName) => {
    const pathToFile = path.resolve(this.currentDir, fileName);

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

    const pathToFile = path.resolve(this.currentDir, originalFileName);
    const pathToRenamedFile = path.resolve(this.currentDir, newFileName);

    try {
      await access(pathToFile);
      await rename(pathToFile, pathToRenamedFile);
      console.log(`${originalFileName} renamed into ${newFileName}`);
    } catch (error) {
      console.log(`Couldn't find such file as ${originalFileName}`);
    }
  };

  cp = async (pathFrom, pathTo) => {
    const pathToCopyFrom = path.resolve(this.currentDir, pathFrom);
    const pathToCopyTo = path.resolve(this.currentDir, pathTo);

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
    const pathToNewDir = path.resolve(this.currentDir, pathTo, fileName);

    await this.cp(pathFrom, pathToNewDir);
    await this.rm(pathFrom, false);
  };

  rm = async (enteredPath, mode = true) => {
    const resolevedPath = path.resolve(this.currentDir, enteredPath);

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
    const pathToFile = path.resolve(this.currentDir, pathTo);

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
    const fileName = path.resolve(pathFrom).split(sep).pop();
    const pathToCompressFrom = path.resolve(this.currentDir, pathFrom);
    const pathToCompressTo = path.resolve(this.currentDir, pathTo, fileName + '.br');

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
    const fileName = path.resolve(pathFrom).split(sep).pop().split('.');
    fileName.pop();
    const pathToDecompressFrom = path.resolve(this.currentDir, pathFrom);
    const pathToDecompressTo = path.resolve(this.currentDir, pathTo, fileName.join('.'));

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
