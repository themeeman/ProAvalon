import { Injectable, Logger } from '@nestjs/common';
import {
  transformAndValidateSync,
  Event,
  RoomEventType,
  RoomIdDto,
} from '@proavalon/proto';

import RedisClientService from '../redis-client/redis-client.service';
import RedisAdapterService from '../redis-adapter/redis-adapter.service';
import Room from './room';
import { SocketUser } from '../users/users.socket';

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  constructor(
    private readonly redisClientService: RedisClientService,
    private readonly redisAdapterService: RedisAdapterService,
  ) {
    this.logger.log('RoomsService constructor');
  }

  async getRoom(id: number): Promise<Room> {
    const gameString = await this.redisClientService.client.get(
      `gameData:${id}`,
    );

    if (gameString) {
      return new Room(gameString);
    }

    // TODO proper way to handle this error and communicate it back
    throw new Error(`Game ID: ${id} was not found.`);
  }

  // Fetch the game, parse it in, then forward the event
  async event(socket: SocketUser, event: Event) {
    let roomId = socket.lastRoomId;

    if (event.type === RoomEventType.JOIN_ROOM) {
      transformAndValidateSync(RoomIdDto, event.data);
      roomId = event.data.roomId;
    }

    await this.redisClientService.lockDo(
      `gameData:${roomId}`,
      async (_client, multi) => {
        const room = await this.getRoom(roomId as number);
        room.event(socket, event);

        // Save the game
        multi.set(`gameData:${roomId}`, room.serialize());

        room.sendRoomDataToAll(this.redisAdapterService);
      },
    );
  }
}
