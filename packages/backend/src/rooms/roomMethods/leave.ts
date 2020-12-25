import { EventFunc } from '../types';

export const leave: EventFunc = async (data, socket, _event) => {
  data.room.players = data.room.players.filter(
    (p) => p.username !== socket.user.username,
  );

  data.room.spectators = data.room.spectators.filter(
    (p) => p.username !== socket.user.username,
  );

  socket.lastRoomId = undefined;
};
