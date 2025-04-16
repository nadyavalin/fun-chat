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
import { requestDataTemplate } from "../utils/dataTemplate";

export const socket = new WebSocket("ws://localhost:4000");

socket.addEventListener("message", (event) => {
  const response: TResponse = JSON.parse(event.data);
  console.log("Received WebSocket message:", JSON.stringify(response, null, 2));
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

export function login(id: string | null, payload: UserLoginPayloadRequest): void {
  requestDataTemplate(id, MessageType.USER_LOGIN, payload);
}

export function logout(id: string, payload: UserLogoutPayloadRequest): void {
  requestDataTemplate(id, MessageType.USER_LOGOUT, payload);
}

export function activeUser(id: string | null = null): void {
  requestDataTemplate(id, MessageType.USER_ACTIVE, null);
}

export function inactiveUser(id: string | null = null): void {
  requestDataTemplate(id, MessageType.USER_INACTIVE, null);
}

export function sendMessageToUser(id: string, payload: SendMessageRequest): void {
  requestDataTemplate(id, MessageType.MSG_SEND, payload);
}

export function getMessageHistoryWithUser(id: string, payload: MessageHistoryWithUsersRequest): void {
  requestDataTemplate(id, MessageType.MSG_FROM_USER, payload);
}

export function getMessageReadStatusChange(id: string, payload: MessageReadRequest): void {
  requestDataTemplate(id, MessageType.MSG_READ, payload);
}

export function getMessageDelete(id: string, payload: MessageDeleteRequest): void {
  requestDataTemplate(id, MessageType.MSG_DELETE, payload);
}

export function getMessageEdit(id: string, payload: MessageEditRequest): void {
  requestDataTemplate(id, MessageType.MSG_EDIT, payload);
}
