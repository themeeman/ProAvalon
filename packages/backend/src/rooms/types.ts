import { Event, ChatResponseType, GameMode, RoomState } from '@proavalon/proto';
import { IsString, IsEnum, IsInt } from 'class-validator';
import { SocketUser } from '../users/users.socket';

export class PlayerData {
  @IsString()
  username!: string;

  @IsString()
  displayUsername!: string;

  @IsString()
  socketId!: string;
}

export class RoomData {
  @IsInt()
  id!: number;

  @IsEnum(RoomState)
  state!: RoomState;

  @IsString()
  host!: string;

  @IsEnum(GameMode)
  mode!: GameMode;

  @IsString({ each: true })
  roles!: string[];

  @IsEnum(PlayerData, { each: true })
  players!: PlayerData[];

  @IsEnum(PlayerData, { each: true })
  spectators!: PlayerData[];

  @IsString({ each: true })
  kickedPlayers!: string[];

  @IsString()
  gameBarMsg!: string;
}

export class FullRoomData {
  room!: RoomData;
}

export type EventFunc = (
  roomData: FullRoomData,
  socket: SocketUser,
  event: Event,
  sendChatToRoom: (text: string, type: ChatResponseType) => void,
) => boolean | Promise<boolean>;
