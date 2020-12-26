import { RoomDataClient } from '@proavalon/proto/room';
import { RoomActionTypes, SET_ROOM } from './types';

export const setRoom = (payload: RoomDataClient): RoomActionTypes => {
  return {
    type: SET_ROOM,
    payload,
  };
};
