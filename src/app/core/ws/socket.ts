import { io } from "socket.io-client";

const url = process.env.API_BASE_URL as string;

export const socket = io(url);
