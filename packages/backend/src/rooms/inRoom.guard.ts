import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Event, RoomEventType } from '@proavalon/proto';
import { SocketUser } from '../users/users.socket';

const getRoomIdFromSocketRooms = (socket: SocketUser) => {
  // Get the user's possible game rooms
  const gameRooms = Object.keys(socket.rooms).filter((room) =>
    room.includes('game'),
  );

  if (gameRooms.length !== 1) {
    throw new Error(
      'Could not extract room Id from their joined socket rooms.',
    );
  }

  // socket.io-redis room name: 'game:<id>'
  const roomKey = gameRooms[0];
  const gameId = parseInt(roomKey.replace('game:', ''), 10);

  return gameId;
};

@Injectable()
export class InRoom implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const socket = context.switchToWs().getClient() as SocketUser;
    const data = context.switchToWs().getData() as Event;

    if (data.type === RoomEventType.JOIN_ROOM) {
      return true;
    }

    if (socket.lastRoomId === undefined) {
      try {
        socket.lastRoomId = getRoomIdFromSocketRooms(socket);
      } catch (e) {
        socket.emit('oops', 'Not in a room');
      }
    }

    return socket.lastRoomId !== undefined;
  }
}
