import { transformAndValidateSync, RoomIdDto } from '@proavalon/proto';
import { EventFunc } from '../types';

export const join: EventFunc = async (roomData, socket, event) => {
  transformAndValidateSync(RoomIdDto, event.data);

  const spectators = roomData.room.spectators.filter(
    (p) => p.username === socket.user.username,
  );

  socket.lastRoomId = roomData.room.id;
  socket.join(`game:${socket.lastRoomId}`);

  if (spectators.length !== 0) {
    // TODO
    throw new Error('Player already joined.');
  }

  roomData.room.spectators.push({
    socketId: socket.id,
    username: socket.user.username,
    displayUsername: socket.user.displayUsername,
  });
};
