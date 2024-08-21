import { atom } from "jotai/index";
import { ICoordinates, ICoordinatesWithHit } from "@/app/shared/types";
import { httpClient } from "@/app/core/httpClient";
import { apiPaths } from "@/app/core/httpClient/apiPaths";
import * as coreModels from "@/app/core/models";
import { NotificationTitleIcon } from "@/app/shared/enums";
import { $notification, $webApp } from "@/app/core/models";
import { storageKeys } from "@/app/shared/constants";
export enum GameStatusEnum {
  RabbitsSet = "rabbitsSet",
  UserTurn = "userTurn",
  OpponentTurn = "opponentTurn",
}

export interface IGame {
  isDisableField: boolean;
  gameId: number;
  moveDeadline: number;
  isScCreated: boolean;
  status?: GameStatusEnum;
  isCreator?: boolean;
  bet?: string;
  myRabbits: ICoordinates[];
  steps: ICoordinatesWithHit[];
  currentStep?: ICoordinates;
  opponent: {
    isInRoom: boolean;
    steps: ICoordinatesWithHit[];
    userName?: string;
  };
}

export const $game = atom<IGame>({
  moveDeadline: 0,
  isDisableField: false,
  gameId: 1,
  myRabbits: [],
  steps: [],
  status: GameStatusEnum.UserTurn,
  isScCreated: false,
  opponent: {
    isInRoom: false,
    steps: [],
  },
});

interface ILoadGameData {
  gameId: number;
  isCreator: boolean;
  isScCreated: boolean;
  userSteps: ICoordinatesWithHit[];
  isUserTurn: boolean;
  bet: string;
  moveDeadline: number;
  opponentName: string;
  opponentSteps: ICoordinatesWithHit[];
}

export const $doLoadGameData = atom(
  null,
  async (get, set, args: { roomId: string }) => {
    const { roomId } = args;
    const initData = get($webApp)?.initData;
    if (initData) {
      const response = await httpClient.get<ILoadGameData>(
        apiPaths.getGameData(roomId),
        initData,
      );
      if (response.data) {
        const tgStorage = get(coreModels.$tgStorage);
        const webApp = get(coreModels.$webApp);
        const userRabbits: ICoordinates[] = (await tgStorage?.getInfo(
          webApp?.initDataUnsafe.user?.id as number,
          storageKeys.rabbits(response.data.gameId.toString()),
        )) as ICoordinates[];
        const {
          gameId,
          isCreator,
          userSteps,
          isUserTurn,
          moveDeadline,
          bet,
          opponentSteps,
          opponentName,
          isScCreated,
        } = response.data;
        set($game, {
          isDisableField: false,
          gameId,
          isCreator,
          isScCreated,
          steps: userSteps,
          status:
            !isUserTurn && moveDeadline < Number(Date.now())
              ? GameStatusEnum.UserTurn
              : GameStatusEnum.OpponentTurn,
          myRabbits: userRabbits,
          bet,
          moveDeadline,
          opponent: {
            isInRoom: true,
            steps: opponentSteps,
            userName: opponentName,
          },
        });
      } else {
        set($notification, {
          titleIcon: NotificationTitleIcon.Error,
          isOpen: true,
          title: "An error occurred",
          description: { text: response.error },
        });
      }
    }
  },
);
