import { CloudStorage, WebApp } from "@twa-dev/types";

export class TgStorage {
  public cloudStorage: CloudStorage;

  constructor(webApp: WebApp) {
    this.cloudStorage = webApp.CloudStorage;
  }

  saveInfo = <T>(tgUserId: number, key: string, value: T) => {
    const tgValue = JSON.stringify(value);
    const tkKey = `${tgUserId}_${key}`;
    this.cloudStorage.setItem(tkKey, tgValue);
  };

  getInfo = <T>(tgUserId: number, key: string): Promise<T> => {
    const tkKey = `${tgUserId}_${key}`;

    return new Promise((resolver, reject) => {
      this.cloudStorage.getItem(
        tkKey,
        (error: string | null, result?: string | undefined) => {
          if (result) {
            const res: T = JSON.parse(result);
            resolver(res);
          } else {
            reject(error);
          }
        },
      );
    });
  };
}
