export const showHelp = (obj) => {
  Object.entries(obj).map(([key, value]) => process.stdout.write(`${key}: ${value}\n\n`));
};
