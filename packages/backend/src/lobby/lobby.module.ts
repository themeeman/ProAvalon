import { Module, forwardRef } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyGateway } from './lobby.gateway';
import { RedisAdapterModule } from '../redis-adapter/redis-adapter.module';
import { RedisClientModule } from '../redis-client/redis-client.module';
import { CommandsModule } from '../commands/commands.module';
import { AllChatModule } from '../all-chat/all-chat.module';

@Module({
  imports: [
    RedisAdapterModule,
    RedisClientModule,
    forwardRef(() => CommandsModule),
    forwardRef(() => AllChatModule),
  ],
  controllers: [],
  providers: [LobbyService, LobbyGateway],
  exports: [LobbyService, LobbyGateway],
})
export class LobbyModule {}
