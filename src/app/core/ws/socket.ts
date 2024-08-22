import { io } from "socket.io-client";
import WebApp from "@twa-dev/sdk";

// const url = "http://localhost:3001";
const url = process.env.API_BASE_URL as string;

export const socket = io(url, {
  auth: { ["authorization"]: WebApp.initData },
});
