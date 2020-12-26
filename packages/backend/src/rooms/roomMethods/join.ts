import {
  transformAndValidateSync,
  RoomIdDto,
  ChatResponseType,
} from '@proavalon/proto';
import { getSocketRoomKeyFromId } from '../../util/socketKeyUtil';
import { EventFunc } from '../types';

export const join: EventFunc = (roomData, socket, event, sendChatToRoom) => {
  transformAndValidateSync(RoomIdDto, event.data);

  const spectators = roomData.room.spectators.filter(
    (p) => p.username === socket.user.username,
  );

  socket.lastRoomId = roomData.room.id;
  socket.join(getSocketRoomKeyFromId(socket.lastRoomId));

  if (spectators.length !== 0) {
    // TODO
    throw new Error('Player already joined.');
  }

  roomData.room.spectators.push({
    socketId: socket.id,
    username: socket.user.username,
    displayUsername: socket.user.displayUsername,
  });

  sendChatToRoom(
    `${socket.user.displayUsername} has joined the room.`,
    ChatResponseType.PLAYER_JOIN_GAME,
  );

  return true;
};
