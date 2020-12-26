import { Injectable, Logger } from '@nestjs/common';
import {
  ChatResponse,
  ChatResponseType,
  LobbyEventType,
} from '@proavalon/proto/lobby';
import { SocketUser } from '../users/users.socket';
import { CommandsService } from '../commands/commands.service';
// import { RedisClientService } from 'src/redis-client/redis-client.service';
import { RedisAdapterService } from '../redis-adapter/redis-adapter.service';

@Injectable()
export class AllChatService {
  private readonly logger = new Logger(AllChatService.name);
  constructor(
    private readonly commandsService: CommandsService,
    // private readonly redisClientService: RedisClientService,
    private readonly redisAdapterService: RedisAdapterService,
  ) {}

  messages: ChatResponse[] = [];

  chat(socket: SocketUser, text: string) {
    // Commands
    if (this.commandsService.run(socket, text)) {
      return;
    }

    // Chat message
    this.logger.log(`All chat message: ${socket.user.username}: ${text} `);

    const chatResponse: ChatResponse = {
      text,
      username: socket.user.displayUsername,
      timestamp: new Date(),
      type: ChatResponseType.CHAT,
    };

    this.storeMessage(chatResponse);

    this.redisAdapterService.server
      .to('lobby')
      .emit(LobbyEventType.ALL_CHAT_TO_CLIENT, chatResponse);
  }

  getMessages(): ChatResponse[] {
    return this.messages;
  }

  storeMessage(message: ChatResponse) {
    this.messages.push(message);
    if (this.messages.length > 50) {
      this.messages.splice(0, 1);
    }
    return message;
  }

  deleteAllMessages() {
    this.messages = [];
  }
}
