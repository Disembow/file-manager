// import fs from 'fs';
import { access } from 'fs/promises';

const dir = '..\\file-manager\\utils\\as';

try {
  await access(dir);
  console.error('Directory exist');
} catch (error) {
  console.log('Directory not exist');
}
