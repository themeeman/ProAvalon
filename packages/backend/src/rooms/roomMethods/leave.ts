import { ChatResponseType } from '@proavalon/proto';
import { EventFunc } from '../types';
import { getSocketRoomKeyFromId } from '../../util/socketKeyUtil';

export const leave: EventFunc = (data, socket, _event, sendChatToRoom) => {
  data.room.players = data.room.players.filter(
    (p) => p.username !== socket.user.username,
  );

  data.room.spectators = data.room.spectators.filter(
    (p) => p.username !== socket.user.username,
  );

  socket.leave(getSocketRoomKeyFromId(socket.lastRoomId as number));
  socket.lastRoomId = undefined;

  sendChatToRoom(
    `${socket.user.displayUsername} has left the room.`,
    ChatResponseType.PLAYER_LEAVE_GAME,
  );

  return true;
};
