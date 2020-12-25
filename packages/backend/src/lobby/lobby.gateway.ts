import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Event } from '@proavalon/proto';
import { LobbyEventType } from '@proavalon/proto/lobby';
import { Server } from 'socket.io';

import { LobbyService } from './lobby.service';
import { SocketUser } from '../users/users.socket';
// import { CommandsService } from '../commands/commands.service';

@WebSocketGateway()
export class LobbyGateway {
  @WebSocketServer() server!: Server;

  private readonly logger = new Logger(LobbyGateway.name);

  constructor(private lobbyService: LobbyService) {
    this.logger.log('LobbyService constructor');
  }

  @SubscribeMessage(LobbyEventType.LOBBY_EVENT)
  async lobbyEvent(socket: SocketUser, event: Event) {
    this.lobbyService.event(socket, event);
  }
}
