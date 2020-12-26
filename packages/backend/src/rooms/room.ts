import { Logger } from '@nestjs/common';
import {
  Event,
  LobbyRoomData,
  ChatResponseType,
  transformAndValidateSync,
} from '@proavalon/proto';
import {
  RoomEventType,
  CreateRoomDto,
  GameMode,
  RoomDataClient,
  RoomState,
} from '@proavalon/proto/room';
import { SocketUser } from '../users/users.socket';
import { FullRoomData, RoomData } from './types';

import { sitDown } from './roomMethods/sitDown';
import { standUp } from './roomMethods/standUp';
import { join } from './roomMethods/join';
import { leave } from './roomMethods/leave';
import { RedisAdapterService } from '../redis-adapter/redis-adapter.service';
import { getSocketRoomKeyFromId } from '../util/socketKeyUtil';

export default class Room {
  private readonly logger: Logger;
  private data: FullRoomData;

  constructor(gameString: string) {
    this.logger = new Logger(Room.name);
    this.data = JSON.parse(gameString);

    transformAndValidateSync(RoomData, this.data.room);

    this.logger.debug('Starting Room constructor');
  }

  serialize() {
    return JSON.stringify(this.data, null, 2);
  }

  getLobbyRoomData(): LobbyRoomData {
    return {
      id: this.data.room.id,
      host: this.data.room.host,
      mode: GameMode.AVALON,
      avatarLinks: [''],
      numSpectators: 0,
      missionOutcome: [],
    };
  }

  static createNewGameState(
    socket: SocketUser,
    _data: CreateRoomDto,
    id: number,
  ): FullRoomData {
    return {
      room: {
        id,
        state: RoomState.waiting,
        host: socket.user.displayUsername,
        mode: GameMode.AVALON,
        roles: ['Assassin', 'Merlin'],
        players: [],
        spectators: [],
        kickedPlayers: [],
        gameBarMsg: 'Waiting',
      },
    };
  }

  getRoomDataToUser(): RoomDataClient {
    const playerData = this.data.room.players.map((player) => ({
      displayUsername: player.displayUsername,
    }));

    const spectatorData = this.data.room.spectators.map((player) => ({
      displayUsername: player.displayUsername,
    }));

    const roomData = this.data.room;

    return {
      id: roomData.id,
      state: roomData.state,
      host: roomData.host,
      mode: roomData.mode,
      roles: roomData.roles,
      playerData,
      spectatorData,
      kickedPlayers: roomData.kickedPlayers,
      gameBarMsg: roomData.gameBarMsg,
    };
  }

  sendRoomDataToSocket(socket: SocketUser) {
    const roomData = this.getRoomDataToUser();
    return socket.emit(RoomEventType.UPDATE_ROOM, roomData);
  }

  sendRoomDataToAll(redisAdapter: RedisAdapterService) {
    const roomId = this.data.room.id;
    const roomData = this.getRoomDataToUser();

    return redisAdapter.server
      .to(getSocketRoomKeyFromId(roomId))
      .emit(RoomEventType.UPDATE_ROOM, roomData);
  }

  async event(
    socket: SocketUser,
    event: Event,
    sendChatToRoom: (text: string, type: ChatResponseType) => void,
  ): Promise<boolean> {
    if (event.type === RoomEventType.JOIN_ROOM) {
      return join(this.data, socket, event, sendChatToRoom);
    }
    if (event.type === RoomEventType.LEAVE_ROOM) {
      return leave(this.data, socket, event, sendChatToRoom);
    }
    if (event.type === RoomEventType.SIT_DOWN) {
      return sitDown(this.data, socket, event, sendChatToRoom);
    }
    if (event.type === RoomEventType.STAND_UP) {
      return standUp(this.data, socket, event, sendChatToRoom);
    }
    if (event.type === RoomEventType.START_GAME) {
      // TODO
    }
    if (event.type === RoomEventType.ROOM_CHAT_TO_CLIENT) {
      // TODO
    }
    if (event.type === RoomEventType.ROOM_CHAT_TO_SERVER) {
      // TODO
    }

    return false;
  }
}
