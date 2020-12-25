import { Logger } from '@nestjs/common';
import { Event, LobbyRoomData } from '@proavalon/proto';
import {
  RoomEventType,
  CreateRoomDto,
  GameMode,
  RoomDataClient,
  RoomState,
} from '@proavalon/proto/room';
import { SocketUser } from '../users/users.socket';
import { RoomData } from './types';

import { sitDown } from './roomMethods/sitDown';
import { standUp } from './roomMethods/standUp';
import { join } from './roomMethods/join';
import { leave } from './roomMethods/leave';
import RedisAdapterService from '../redis-adapter/redis-adapter.service';

export default class Room {
  private readonly logger: Logger;
  private data: RoomData;

  constructor(gameString: string) {
    this.logger = new Logger(Room.name);
    this.data = JSON.parse(gameString);

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

  static async createNewGameState(
    socket: SocketUser,
    _data: CreateRoomDto,
    id: number,
  ): Promise<RoomData> {
    return {
      room: {
        players: [],
        spectators: [],
        host: socket.user.displayUsername,
        id,
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

    return {
      id: this.data.room.id,
      state: RoomState.waiting,
      host: this.data.room.host,
      mode: GameMode.AVALON,
      roles: ['merlin', 'assassin'],
      playerData,
      spectatorData,
      kickedPlayers: ['kickedUsername'],
      gameBarMsg: 'asdf',
    };
  }

  sendRoomDataToSocket(socket: SocketUser) {
    const roomData = this.getRoomDataToUser();
    return socket.emit(RoomEventType.UPDATE_ROOM, roomData);
  }

  sendRoomDataToAll(redisAdapter: RedisAdapterService) {
    const roomId = this.data.room.id;
    const roomData = this.getRoomDataToUser();

    console.log('Emitting to ', roomId);

    return redisAdapter.server
      .to(`game:${roomId}`)
      .emit(RoomEventType.UPDATE_ROOM, roomData);
  }

  // TODO Data structure
  async event(socket: SocketUser, event: Event): Promise<void> {
    if (event.type === RoomEventType.JOIN_ROOM) {
      join(this.data, socket, event);
    } else if (event.type === RoomEventType.LEAVE_ROOM) {
      leave(this.data, socket, event);
    } else if (event.type === RoomEventType.SIT_DOWN) {
      sitDown(this.data, socket, event);
    } else if (event.type === RoomEventType.STAND_UP) {
      standUp(this.data, socket, event);
    } else if (event.type === RoomEventType.START_GAME) {
      // TODO
    } else if (event.type === RoomEventType.ROOM_CHAT_TO_CLIENT) {
      // TODO
    } else if (event.type === RoomEventType.ROOM_CHAT_TO_SERVER) {
      // TODO
    }
  }
}
