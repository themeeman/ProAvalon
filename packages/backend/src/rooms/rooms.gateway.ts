import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { Event } from '@proavalon/proto';
import { RoomEventType } from '@proavalon/proto/room';
import { Server } from 'socket.io';

import { RoomsService } from './rooms.service';
import { RoomChatInterceptor } from './room-chat.interceptor';
import { SocketUser } from '../users/users.socket';
import { InRoom } from './inRoom.guard';

@UseGuards(InRoom)
@WebSocketGateway()
export class RoomsGateway {
  @WebSocketServer() server!: Server;

  private readonly logger = new Logger(RoomsGateway.name);

  constructor(
    private roomsService: RoomsService, //   private commandsService: CommandsService,
  ) {
    this.logger.log('RoomsGateway constructor');
  }

  @SubscribeMessage(RoomEventType.ROOM_EVENT)
  @UseInterceptors(RoomChatInterceptor)
  async roomEvent(socket: SocketUser, event: Event) {
    const res = await this.roomsService.event(socket, event);

    if (res === true) {
      return 'OK';
    }
    return 'FAIL';
  }
}
