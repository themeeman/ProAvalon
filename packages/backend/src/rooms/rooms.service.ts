import { Injectable, Logger } from '@nestjs/common';
import {
  transformAndValidateSync,
  Event,
  RoomEventType,
  RoomIdDto,
  ChatResponseType,
  ChatResponse,
} from '@proavalon/proto';

import { RedisClientService } from '../redis-client/redis-client.service';
import { RedisAdapterService } from '../redis-adapter/redis-adapter.service';
import Room from './room';
import { SocketUser } from '../users/users.socket';
import { getSocketRoomKeyFromId } from '../util/socketKeyUtil';
import { CommandsService } from '../commands/commands.service';

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  constructor(
    private readonly commandsService: CommandsService,
    private readonly redisClientService: RedisClientService,
    private readonly redisAdapterService: RedisAdapterService,
  ) {
    this.logger.log('RoomsService constructor');
  }

  sendChatToRoomGen(roomId: number) {
    return (text: string, type: ChatResponseType) => {
      const chatResponse: ChatResponse = {
        text,
        username: '',
        timestamp: new Date(),
        type,
      };

      this.redisAdapterService.server
        .to(getSocketRoomKeyFromId(roomId))
        .emit(RoomEventType.ROOM_CHAT_TO_CLIENT, chatResponse);
    };
  }

  async chat(socket: SocketUser, text: string) {
    // Commands
    if (this.commandsService.run(socket, text)) {
      return;
    }

    // Chat message
    this.logger.log(`Room chat message: ${socket.user.username}: ${text} `);

    const chatResponse: ChatResponse = {
      text,
      username: socket.user.displayUsername,
      timestamp: new Date(),
      type: ChatResponseType.CHAT,
    };

    this.redisAdapterService.server
      .to(getSocketRoomKeyFromId(socket.lastRoomId as number))
      .emit(RoomEventType.ROOM_CHAT_TO_CLIENT, chatResponse);

    // TODO Save the chat
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
  async event(socket: SocketUser, event: Event): Promise<boolean> {
    let roomId = socket.lastRoomId;

    if (event.type === RoomEventType.JOIN_ROOM) {
      transformAndValidateSync(RoomIdDto, event.data);
      roomId = event.data.roomId;
    }

    let result = false;

    await this.redisClientService.lockDo(
      `gameData:${roomId}`,
      async (_client, multi) => {
        const room = await this.getRoom(roomId as number);
        result = await room.event(
          socket,
          event,
          this.sendChatToRoomGen(roomId as number),
        );

        // Save the game
        multi.set(`gameData:${roomId}`, room.serialize());

        room.sendRoomDataToAll(this.redisAdapterService);
      },
    );

    return result;
  }
}
