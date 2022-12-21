import { a } from './a';
import { aemailtousername } from './aemailtousername';
import { aip } from './aip';
import { aresetpassword } from './aresetpassword';
import { Commands } from '../types';

export const adminCommands: Commands = {
  [a.command]: a,
  [aemailtousername.command]: aemailtousername,
  [aip.command]: aip,
  [aresetpassword.command]: aresetpassword,
};
