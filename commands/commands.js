import { EOL } from 'os';

export const commands = {
  '--help': 'Show list of available commands',
  up: 'Go upper from current directory',
  cd: 'Go to dedicated folder from current directory: up <path_to_directory>',
  ls: 'Print in console list of all files and folders in current directory',
  cat: "Read file and print it's content in console: cat <path_to_file>",
  add: 'Create empty file in current working directory: add <new_file_name>',
  rn: 'Rename file: rn <path_to_file> <new_filename>',
  cp: 'Copy file: cp <path_to_file> <path_to_new_directory>',
  mv: 'Move file: mv <path_to_file> <path_to_new_directory>',
  rm: 'Delete file: rm <path_to_file>',
  os: `Operating system info: os --flag:${EOL}  --EOL - get system End-Of-Line${EOL}  --cpus - Get host machine CPUs info${EOL}  --homedir - Get current system user name${EOL}  --username - Get current system user name${EOL}  --architecture - Get CPU architecture for which Node.js binary has compiled`,
  hash: 'Calculate hash for file: hash <path_to_file>',
  compress: 'Compress file (using Brotli algorithm): compress <path_to_file> <path_to_destination>',
  decompress:
    'Decompress file (using Brotli algorithm): decompress <path_to_file> <path_to_destination>',
};
