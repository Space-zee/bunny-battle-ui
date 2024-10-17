export enum SocketEvents {
  //Game
  JoinRoomClient = "joinRoomClient",
  JoinRoomServer = "joinRoomServer",
  ReadyForBattle = "readyForBattle",
  ClientRabbitsSet = "clientRabbitsSet",
  GameCreated = "gameCreated",
  GameStarted = "gameStarted",
  ClientUserMove = "clientUserMove",
  ServerUserMove = "serverUserMove",
  CheckDeadlineClient = "checkDeadlineClient",
  CheckDeadlineServer = "checkDeadlineServer",
  ConfirmWin = "confirmWin",
  Winner = "winner",
  LeaveRoomClient = "leaveRoomClient",
  LeaveRoomServer = "leaveRoomServer",
  TxFailed = "txFailed",
  AuthError = "authError",
  //Global
  NewGameCreated = "newGameCreated",
  GameDeleted = "gameDeleted",
}
