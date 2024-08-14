import { RoomStatusServerEnum } from "@/app/shared/enums";

export interface IGetActiveGamesRes {
  status: RoomStatusServerEnum;
  bet: string;
  roomId: string;
  creator: {
    username: string;
    photo: string;
    telegramUserId: number;
  };
  joiner?: {
    username: string;
    photo: string;
    telegramUserId: number;
  };
}
