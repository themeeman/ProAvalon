import { Event } from '@proavalon/proto';
import { SocketUser } from '../users/users.socket';

export interface PlayerData {
  username: string;
  displayUsername: string;
  socketId: string;
}

export interface RoomData {
  room: {
    id: number;
    host: string;
    players: PlayerData[];
    spectators: PlayerData[];
  };
}

export type EventFunc = (
  roomData: RoomData,
  socket: SocketUser,
  event: Event,
) => Promise<void>;
