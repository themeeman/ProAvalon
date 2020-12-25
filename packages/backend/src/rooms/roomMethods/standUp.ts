import { EventFunc } from '../types';

export const standUp: EventFunc = async (data, socket, _event) => {
  const players = data.room.players.filter(
    (p) => p.username === socket.user.username,
  );

  if (players.length !== 1) {
    // TODO
    throw new Error(`Expected only one player, got ${players.length}`);
  }

  data.room.spectators.push(players[0]);
  data.room.players = data.room.players.filter(
    (p) => p.username !== socket.user.username,
  );
};
