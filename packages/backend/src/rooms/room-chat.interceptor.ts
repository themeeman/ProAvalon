import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import {
  transformAndValidateSync,
  ChatRequest,
  RoomEventType,
} from '@proavalon/proto';
import { Observable, of } from 'rxjs';
import { RoomsService } from './rooms.service';

@Injectable()
export class RoomChatInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RoomChatInterceptor.name);

  constructor(private readonly roomsService: RoomsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const event = context.switchToWs().getData();
    const socket = context.switchToWs().getClient();

    if (event.type !== RoomEventType.ROOM_CHAT_TO_SERVER) {
      return next.handle();
    }

    this.logger.debug('Room chat interceptor data: ');
    this.logger.debug(JSON.stringify(event));

    const chatRequest: ChatRequest = event.data;

    transformAndValidateSync(ChatRequest, chatRequest);

    this.roomsService.chat(socket, chatRequest.text);

    return of();
  }
}
