import { showError } from "../utils/elements";
import {
  deleteMessage,
  editMessage,
  receiveMessage,
  showChatHistory,
  showDeliveredMessageStatus,
  showReadMessageStatus,
} from "../pages/chat/chat";
import {
  setActiveUsers,
  setInactiveUsers,
  externalUserLogin,
  externalUserLogout,
  userLogin,
  userLogout,
} from "../pages/form/loginForm";
import {
  TResponse,
  MessageType,
  UserLoginPayloadRequest,
  UserLogoutPayloadRequest,
  SendMessageRequest,
  MessageHistoryWithUsersRequest,
  MessageReadRequest,
  MessageDeleteRequest,
  MessageEditRequest,
} from "../types/types";

export const socket = new WebSocket("ws://localhost:4000");

socket.addEventListener("message", (event) => {
  const response: TResponse = JSON.parse(event.data);
  switch (response.type) {
    case MessageType.USER_LOGIN: {
      userLogin(response.payload);
      break;
    }
    case MessageType.USER_LOGOUT: {
      userLogout();
      break;
    }
    case MessageType.USER_EXTERNAL_LOGIN: {
      externalUserLogin(response.payload);
      break;
    }
    case MessageType.USER_EXTERNAL_LOGOUT: {
      externalUserLogout(response.payload);
      break;
    }
    case MessageType.USER_ACTIVE: {
      setActiveUsers(response.payload);
      break;
    }
    case MessageType.USER_INACTIVE: {
      setInactiveUsers(response.payload);
      break;
    }
    case MessageType.MSG_SEND: {
      receiveMessage(response.payload);
      break;
    }
    case MessageType.MSG_FROM_USER: {
      showChatHistory(response);
      break;
    }
    case MessageType.MSG_DELIVER: {
      showDeliveredMessageStatus(response);
      break;
    }
    case MessageType.MSG_READ: {
      showReadMessageStatus(response);
      break;
    }
    case MessageType.MSG_DELETE: {
      deleteMessage(response.payload);
      break;
    }
    case MessageType.MSG_EDIT: {
      editMessage(response.payload);
      break;
    }
    case MessageType.ERROR: {
      showError(response);
      break;
    }
    default: {
      break;
    }
  }
});

export function login(id: string, payload: UserLoginPayloadRequest) {
  const requestData = {
    id,
    type: MessageType.USER_LOGIN,
    payload,
  };

  const requestDataString = JSON.stringify(requestData);
  socket.send(requestDataString);
}

export function logout(id: string, payload: UserLogoutPayloadRequest) {
  const requestData = {
    id,
    type: MessageType.USER_LOGOUT,
    payload,
  };

  const requestDataString = JSON.stringify(requestData);
  socket.send(requestDataString);
}

export function activeUser(id: string) {
  const requestData = {
    id,
    type: MessageType.USER_ACTIVE,
    payload: undefined,
  };

  const requestDataString = JSON.stringify(requestData);
  socket.send(requestDataString);
}

export function inactiveUser(id: string) {
  const requestData = {
    id,
    type: MessageType.USER_INACTIVE,
    payload: undefined,
  };

  const requestDataString = JSON.stringify(requestData);
  socket.send(requestDataString);
}

export function sendMessageToUser(id: string, payload: SendMessageRequest) {
  const requestData = {
    id,
    type: MessageType.MSG_SEND,
    payload,
  };

  const requestDataString = JSON.stringify(requestData);
  socket.send(requestDataString);
}

export function getMessageHistoryWithUser(id: string, payload: MessageHistoryWithUsersRequest) {
  const requestData = {
    id,
    type: MessageType.MSG_FROM_USER,
    payload,
  };

  const requestDataString = JSON.stringify(requestData);
  socket.send(requestDataString);
}

export function getMessageReadStatusChange(id: string, payload: MessageReadRequest) {
  const requestData = {
    id,
    type: MessageType.MSG_READ,
    payload,
  };

  const requestDataString = JSON.stringify(requestData);
  socket.send(requestDataString);
}

export function getMessageDelete(id: string, payload: MessageDeleteRequest) {
  const requestData = {
    id,
    type: MessageType.MSG_DELETE,
    payload,
  };

  const requestDataString = JSON.stringify(requestData);
  socket.send(requestDataString);
}

export function getMessageEdit(id: string, payload: MessageEditRequest) {
  const requestData = {
    id,
    type: MessageType.MSG_EDIT,
    payload,
  };

  const requestDataString = JSON.stringify(requestData);
  socket.send(requestDataString);
}
