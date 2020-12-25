import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { RoomEventType } from '@proavalon/proto/room';
import { Event, RoomEventData } from '@proavalon/proto';
import { socket } from '../../socket';
import useAuth from '../../effects/useAuth';

const useGame = (roomId?: string | string[]): void => {
  const user = useAuth();

  const router = useRouter();

  useEffect((): (() => void) => {
    if (Number.isNaN(Number(roomId))) {
      router.replace('/404');
    }

    if (user) {
      const data: RoomEventData = {
        roomId: Number(roomId),
      };

      const event: Event = {
        type: RoomEventType.JOIN_ROOM,
        data,
      };

      socket.emit(RoomEventType.ROOM_EVENT, event, (msg: string) => {
        if (msg !== 'OK') {
          Swal.fire({
            heightAuto: false,
            title: 'Oops',
            text: msg,
            icon: 'error',
          });
        }
      });
    }

    return (): void => {
      const data: RoomEventData = {
        roomId: Number(roomId),
      };

      const event: Event = {
        type: RoomEventType.LEAVE_ROOM,
        data,
      };

      socket.emit(RoomEventType.ROOM_EVENT, event);
    };
  }, [roomId, user, router]);
};

export default useGame;
