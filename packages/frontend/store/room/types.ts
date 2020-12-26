import { RoomDataClient } from '@proavalon/proto/room';

export const SET_ROOM = 'SET_ROOM';

interface ISetGameAction {
  type: typeof SET_ROOM;
  payload: RoomDataClient;
}

export type RoomActionTypes = ISetGameAction;
