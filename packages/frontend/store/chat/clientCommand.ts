import {
  Event,
  RoomEventType,
  LobbyEventType,
  CreateRoomDto,
  GameMode,
  RoomEventData,
} from '@proavalon/proto';
import { socket } from '../../socket';

export const clientCommand = (message: string): boolean => {
  if (message.startsWith('/create')) {
    // eslint-disable-next-line no-console
    console.log('ASDF');

    const data: CreateRoomDto = {
      mode: GameMode.AVALON,
      joinPassword: undefined,
      maxNumPlayers: 10,
    };

    const event: Event = {
      data,
      type: LobbyEventType.CREATE_ROOM,
    };

    socket.emit(LobbyEventType.LOBBY_EVENT, event);

    return true;
  }

  if (message.startsWith('/join')) {
    const splitted = message.split(' ');

    const data: RoomEventData = {
      roomId: Number(splitted[1]),
    };

    const event: Event = {
      data,
      type: RoomEventType.JOIN_ROOM,
    };

    socket.emit(RoomEventType.ROOM_EVENT, event);
    return true;
  }

  if (message.startsWith('/leave')) {
    const splitted = message.split(' ');

    const data: RoomEventData = {
      roomId: Number(splitted[1]),
    };

    const event: Event = {
      data,
      type: RoomEventType.LEAVE_ROOM,
    };

    socket.emit(RoomEventType.ROOM_EVENT, event);
    return true;
  }

  return false;
};
