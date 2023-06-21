import { argv } from 'process';

export const getUserName = () => {
  const userNameArg = 'username';

  return argv.find((e) => e.includes(userNameArg)).split('=')[1];
};
