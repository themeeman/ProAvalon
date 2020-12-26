import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import {
  LobbyEventType,
  transformAndValidateSync,
  ChatRequest,
} from '@proavalon/proto';
import { Observable, of } from 'rxjs';
import { AllChatService } from './all-chat.service';

@Injectable()
export class AllChatInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AllChatInterceptor.name);

  constructor(private readonly allChatService: AllChatService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const event = context.switchToWs().getData();
    const socket = context.switchToWs().getClient();

    if (event.type !== LobbyEventType.ALL_CHAT_TO_SERVER) {
      return next.handle();
    }

    this.logger.debug('All chat interceptor data: ');
    this.logger.debug(JSON.stringify(event));

    transformAndValidateSync(ChatRequest, event.data);

    this.allChatService.chat(socket, event.data.text);

    return of();
  }
}
