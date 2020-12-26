const prefix = 'room:';

export const getSocketRoomKeyFromId = (roomId: number) => `${prefix}${roomId}`;

export const getRoomIdFromSocketKey = (key: string) =>
  parseInt(key.replace(prefix, ''), 10);
