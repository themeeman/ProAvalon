import { Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import {
  Event,
  transformAndValidateSync,
  CreateRoomDto,
  LobbyRoomData,
  LobbyEventType,
} from '@proavalon/proto';

import { RedisAdapterService } from '../redis-adapter/redis-adapter.service';
import { RedisClientService } from '../redis-client/redis-client.service';
import { SocketUser } from '../users/users.socket';
import Room from '../rooms/room';

@Injectable()
export class LobbyService {
  private readonly logger = new Logger(LobbyService.name);

  constructor(
    private readonly redisClientService: RedisClientService,
    private readonly redisAdapterService: RedisAdapterService,
  ) {}

  async event(socket: SocketUser, event: Event): Promise<any> {
    try {
      if (event.type === LobbyEventType.CREATE_ROOM) {
        this.logger.log('Create game request');
        return await this.createGame(socket, event.data);
      }
    } catch (e) {
      this.logger.error(e);
      // TODO This shouldn't be shown to the user, but good for debugging.
      socket.emit('oops', JSON.stringify(e));
    }

    return undefined;
  }

  async createGame(socket: SocketUser, data: CreateRoomDto): Promise<number> {
    transformAndValidateSync(CreateRoomDto, data);

    // Create the game number and open in Redis
    let nextGameNum = -1;
    await this.redisClientService.lockDo(
      'games:open',
      async (client, multi) => {
        // Get the nextGameNum
        nextGameNum = Number(await client.get('games:nextNum'));

        // If nextGameNum hasn't been set yet, start from 1.
        if (nextGameNum === 0) {
          nextGameNum = 1;
          multi.incr('games:nextNum');
        }

        // Add data to Redis
        multi.rpush('games:open', Number(nextGameNum));
        multi.incr('games:nextNum');
      },
    );

    // Create the game state and save in Redis
    try {
      const newGameState = await Room.createNewGameState(
        socket,
        data,
        nextGameNum,
      );

      await this.redisClientService.client.set(
        `gameData:${nextGameNum}`,
        JSON.stringify(newGameState),
      );

      this.logger.log(`Done creating game ${nextGameNum}.`);

      // Cap to 5 games for now
      const gameIds = await this.redisClientService.client.lrange(
        'games:open',
        0,
        -1,
      );

      while (gameIds.length > 5) {
        this.closeGame(parseInt(gameIds.shift() as string, 10));
      }

      this.updateLobbyGames();
      return nextGameNum;
    } catch (e) {
      this.logger.error(e);
      throw new WsException('Failed to create a game.');
    }
  }

  async closeGame(id: number): Promise<boolean> {
    // Check if the room exists:
    if (!(await this.hasGame(id))) {
      return false;
    }

    await this.redisAdapterService.closeRoom(`gameData:${id}`);
    await this.redisClientService.client.lrem('games:open', 0, id.toString());
    await this.redisClientService.client.del(`gameData:${id}`);
    return true;
  }

  async hasGame(id: number): Promise<boolean> {
    const ids = await this.redisClientService.client.lrange(
      'games:open',
      0,
      -1,
    );
    this.logger.log(`Has game ${id}: ${ids.includes(id.toString())}`);
    return ids.includes(id.toString());
  }

  // If socket parameter is undefined, send to whole lobby
  async updateLobbyGames(socket?: SocketUser) {
    this.logger.log('Updating lobby games');
    // Get games and send it out
    const gameIds = await this.redisClientService.client.lrange(
      'games:open',
      0,
      -1,
    );

    const gameStrings = await Promise.all(
      gameIds.map((gameId) =>
        this.redisClientService.client.get(`gameData:${gameId}`),
      ),
    );

    const lobbyGames: LobbyRoomData[] = [];
    gameStrings.forEach((gameString) => {
      if (gameString) {
        lobbyGames.push(new Room(gameString).getLobbyRoomData());
      }
    });

    if (socket) {
      socket.emit(LobbyEventType.UPDATE_LOBBY_ROOMS, lobbyGames);
    } else {
      this.redisAdapterService.server
        .to('lobby')
        .emit(LobbyEventType.UPDATE_LOBBY_ROOMS, lobbyGames);
    }
  }
}
