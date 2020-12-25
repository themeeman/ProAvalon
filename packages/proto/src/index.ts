import { LobbyEventType } from './lobby';
import { RoomEventType } from './room';
import { GameEventType } from './game';
import { IsEnum, IsInt } from 'class-validator';

export {
  transformAndValidate,
  transformAndValidateSync,
} from 'class-transformer-validator';

export const EventType = {
  ...LobbyEventType,
  ...RoomEventType,
  ...GameEventType,
};

export class Event {
  @IsEnum(EventType)
  type!: keyof typeof EventType;
  data!: any;
}

export class RoomEventData {
  @IsInt()
  roomId!: number;
}

export * from './room';
export * from './lobby';
export * from './game';
