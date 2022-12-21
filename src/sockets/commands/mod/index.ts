import { m } from './m';
import { mban } from './mban';
import { mgetban } from './mgetban';
import { Commands } from '../types';
import { munban } from './munban';
import { mcompareips } from './mcompareips';
import { mdc } from './mdc';
import { mnotify } from './mnotify';

export const modCommands: Commands = {
  [m.command]: m,
  [mban.command]: mban,
  [mgetban.command]: mgetban,
  [munban.command]: munban,
  [mcompareips.command]: mcompareips,
  [mdc.command]: mdc,
  [mnotify.command]: mnotify,
};
