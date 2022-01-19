import io from 'socket.io-client';

export const membersSocket = new io(`${process.env.NEXT_PUBLIC__SOCKET_HOST}`, { withCredentials: true });
