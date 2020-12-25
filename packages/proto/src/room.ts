import {
  IsNumber,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { OnlinePlayer } from './lobby';

export enum GameMode {
  VANILLA = 'VANILLA',
  AVALON = 'AVALON',
}

export enum RoomEventType {
  ROOM_EVENT = 'ROOM_EVENT',

  START_GAME = 'START_GAME',

  JOIN_ROOM = 'JOIN_ROOM',
  LEAVE_ROOM = 'LEAVE_ROOM',

  SIT_DOWN = 'SIT_DOWN',
  STAND_UP = 'STAND_UP',

  ROOM_CHAT_TO_CLIENT = 'ROOM_CHAT_TO_CLIENT',
  ROOM_CHAT_TO_SERVER = 'ROOM_CHAT_TO_SERVER',

  UPDATE_ROOM = 'UPDATE_ROOM',
}

// Game Data
export enum RoomState {
  waiting = 'waiting',
  game = 'game',
  finished = 'finished',
}

export class PlayerDataClient {
  @IsString()
  displayUsername!: string;

  @IsString()
  avatarLink?: string;
}

export class RoomDataClient {
  @IsInt()
  id!: number;

  @IsEnum(RoomState)
  state!: RoomState;

  @IsString()
  host!: string; // holds a displayUsername

  @IsEnum(GameMode)
  mode!: GameMode;

  // TODO Replace with allowed roles
  @IsString({
    each: true,
  })
  roles!: string[];

  @ValidateNested({ each: true })
  playerData!: PlayerDataClient[];

  @ValidateNested({ each: true })
  spectatorData!: OnlinePlayer[];

  @IsString({
    each: true,
  })
  kickedPlayers!: string[]; // holds usernames (lowercased)

  @IsString()
  gameBarMsg!: string;
}

export class CreateRoomDto {
  // No need for validators here as it is validated within GameState
  @IsInt()
  @Min(0)
  @Max(10)
  maxNumPlayers!: number;

  @IsOptional()
  @IsString()
  joinPassword!: string | undefined;

  @IsEnum(GameMode)
  mode!: GameMode;
}

export class RoomIdDto {
  @IsNumber()
  roomId!: number;
}
