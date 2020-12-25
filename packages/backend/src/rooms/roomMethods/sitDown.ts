import { EventFunc } from '../types';

export const sitDown: EventFunc = async (data, socket, _event) => {
  const spectators = data.room.spectators.filter(
    (p) => p.username === socket.user.username,
  );

  if (spectators.length !== 1) {
    // TODO
    throw new Error('Player is not a spectator.');
  }

  data.room.players.push(spectators[0]);
  data.room.spectators = data.room.spectators.filter(
    (p) => p.username !== socket.user.username,
  );
};
