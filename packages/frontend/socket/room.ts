import { transformAndValidate } from '@proavalon/proto';
import { RoomDataClient, RoomEventType } from '@proavalon/proto/room';
import { store } from '../store';
import { setRoom } from '../store/room/actions';

export const SetRoomEvents = (socket: SocketIOClient.Socket): void => {
  socket.on(RoomEventType.UPDATE_ROOM, async (roomData: RoomDataClient) => {
    try {
      const roomDataValidated = await transformAndValidate(
        RoomDataClient,
        roomData,
      );
      store.dispatch(setRoom(roomDataValidated));

      console.log('Received room data'); // eslint-disable-line
      console.log(roomDataValidated); // eslint-disable-line
    } catch (err) {
      throw Error(`Validation failed. Error: ${err}`);
    }
  });
};
