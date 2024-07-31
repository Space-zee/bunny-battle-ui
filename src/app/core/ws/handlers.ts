import { socket } from "@/app/core/ws/socket";
import { SocketEvents } from "@/app/core/ws/constants";
import { IJoinRoomReq } from "@/app/core/ws/types";

export const joinRoom = (data: IJoinRoomReq) => {
  socket.emit(SocketEvents.JoinRoomClient, data);
};
