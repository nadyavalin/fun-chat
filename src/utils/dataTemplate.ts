import { socket } from "../api/api";
import { MessageType } from "../types/types";

export function requestDataTemplate<T extends MessageType, U>(id: string | null, type: T, payload?: U): void {
  const requestId = id || `req-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const requestData = {
    id: requestId,
    type,
    payload: payload === undefined ? null : payload,
  };

  const requestDataString = JSON.stringify(requestData);
  socket.send(requestDataString);
}
