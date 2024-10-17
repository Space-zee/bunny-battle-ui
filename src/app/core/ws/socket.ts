import { io } from "socket.io-client";
import WebApp from "@twa-dev/sdk";

// const url = "http://localhost:3001";
const url = process.env.API_BASE_URL as string;
let options;
if (typeof window !== "undefined") {
  options = {
    auth: { ["authorization"]: WebApp.initData },
  };
}

export const socket = io(url, options);
