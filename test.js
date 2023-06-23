import fs from 'fs';
import path from 'path';

const dir = '..\\file-manager\\utils\\';
console.log(dir);

fs.access(dir, (err) =>
  err ? console.error('Directory not exist') : console.log('Directory exist')
);
