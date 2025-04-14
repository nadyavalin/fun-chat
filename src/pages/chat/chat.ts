import {
  MessageDeleteRequest,
  MessageDeliveredStatusRequestFromServer,
  MessageEditRequest,
  MessageReadStatusResponse,
  MessagesHistoryResponse,
  SendMessagePayloadResponse,
} from "../../types/types";
import {
  getMessageDelete,
  getMessageEdit,
  getMessageHistoryWithUser,
  getMessageReadStatusChange,
  sendMessageToUser,
} from "../../api/api";
import state from "../../store/state";
import { infoArea } from "../info/info";
import {
  createButton,
  createDiv,
  createElement,
  createImage,
  createInput,
  createLink,
  createSpan,
  createText,
} from "../../utils/elements";

export const header = createElement("header", ["header"]);
export const main = createElement("main", ["main"]);
export const footer = createElement("footer", ["footer"]);

const leftSide = createDiv(["left-side"]);
const search = createDiv(["left-side__search"]);
export const membersList = createElement("ul", ["left-side__member-list"]);
export const unreadMessage = createSpan(["unread-message"], ``);

const rightSide = createDiv(["right-side"]);
const statusArea = createDiv(["right-side__status-area"]);
const chatArea = createDiv(["right-side__chat-area"]);
const sendMessageFormArea = createElement("form", ["right-side__send-message-area"]);

leftSide.append(search, membersList);
rightSide.append(statusArea, chatArea, sendMessageFormArea);
main.append(leftSide, rightSide);

const headerText = createDiv(["header-text"]);

export const userName = createText(["user-name"], ``);
const chatName = createText(["chat-name"], "Fun Chat");
const headerButtons = createDiv(["header-buttons"]);
export const logoutButton = createButton("logout", ["logout-button"], "logout");
const infoButton = createButton("info", ["info-button"], "info");
headerButtons.append(logoutButton, infoButton);
headerText.append(userName, chatName, headerButtons);
header.append(headerText);

const searchInput = createInput("search-input", "text", ["search-input"], "Search...");
const searchButton = createButton("search-button", ["search-button"], "Search");
search.append(searchInput, searchButton);

const chatAreaText = createText(["chat-area__text"], "Write your first message...");
chatArea.append(chatAreaText);

const messageInput = createInput("send-message-input", "text", ["send-message-input"], "Message...");
const sendButton = createButton("send-button", ["send-button"], "send");
sendMessageFormArea.append(messageInput, sendButton);

const footerText = createDiv(["footer-text"]);
const logoRSSchool = createImage(["logo"], "/img/logo.png", "RSSchool");
const rsschool = createLink("https://rs.school/courses", ["rsschool-text"]);
const githubName = createLink("https://github.com/nadyavalin", ["github-text"], "nadyavalin");
const year = createText(["year-text"], "2024");
rsschool.append(logoRSSchool);
footerText.append(rsschool, githubName, year);
footer.append(footerText);

infoButton.addEventListener("click", () => {
  header.remove();
  main.remove();
  footer.remove();
  document.body.append(infoArea);
});

membersList.addEventListener("click", (event: Event) => {
  statusArea.textContent = "";
  const eventTarget = event.target as HTMLLIElement;
  chatAreaText.scrollIntoView({ block: "end", behavior: "smooth" });
  if (eventTarget && eventTarget.classList.contains("user-item")) {
    const { login } = eventTarget.dataset;

    if (login) {
      const isLogged = eventTarget.classList.contains("user-item_online");
      const status = isLogged ? "online" : "offline";
      state.selectedUser = { login, isLogged: isLogged };
      const chosenUserFromList = createText(["chosen-user"], login);
      const userStatus = createText(["user-status"], status);
      statusArea.append(chosenUserFromList, userStatus);
      chatAreaText.textContent = "";
      getMessageHistoryWithUser("", { user: { login: state.selectedUser.login } });
    }
  }
});

function sendMessage(event: Event) {
  event.preventDefault();
  chatArea.classList.add("right-side__chat-area_talk");
  const messageText = messageInput.value.trim();
  if (messageText !== "" && state.selectedUser?.login) {
    sendMessageToUser("", {
      message: {
        to: state.selectedUser.login,
        text: messageText,
      },
    });
    messageInput.value = "";
    chatAreaText.scrollIntoView({ block: "end", behavior: "smooth" });
  }
}

sendMessageFormArea.addEventListener("submit", sendMessage);

export function deleteMessage(message: MessageDeleteRequest) {
  getMessageDelete("", message);
}

export function editMessage(message: MessageEditRequest) {
  getMessageEdit("", message);
}

export function receiveMessage(payload: SendMessagePayloadResponse) {
  if (payload.message.from === state.selectedUser?.login || payload.message.to === state.selectedUser?.login) {
    chatArea.classList.add("right-side__chat-area_talk");
    const messageArea = createDiv(["message-area"], { key: "id", value: payload.message.id });
    const messageTopArea = createDiv(["message-top-area"]);
    const messageBottomArea = createDiv(["message-bottom-area"]);
    const messageFrom = createSpan(["message-from"], `${payload.message.from}`);
    const messageDateTime = new Date(payload.message.datetime);
    const formatter = new Intl.DateTimeFormat("ru", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const formattedDateTime = formatter.format(messageDateTime);
    const messageDate = createSpan(["message-date"], formattedDateTime);
    const messageText = createText(["message-text"], `${payload.message.text}`);

    messageTopArea.append(messageFrom, messageDate);
    messageArea.append(messageTopArea, messageText, messageBottomArea);
    chatAreaText.append(messageArea);
  }
}

// TODO
export function showDeliveredMessageStatus(response: MessageDeliveredStatusRequestFromServer) {
  const messageId = response.payload.message.id;
  const messageArea = chatArea.querySelector(`.message-area[data-id="${messageId}"]`);
  const messageDeliveredStatus = createSpan(
    ["message-status"],
    `${response.payload.message.status.isDelivered ? "✅ Delivered" : "❌ Not Delivered"}`
  );

  if (messageArea) {
    const messageBottomArea = messageArea.querySelector(".message-bottom-area");
    if (messageBottomArea) {
      messageBottomArea.append(messageDeliveredStatus);
    }
  }
}

// TODO
export function showReadMessageStatus(response: MessageReadStatusResponse) {
  if (response.payload.message.id) {
    getMessageReadStatusChange(response.payload.message.id, {
      message: {
        id: response.payload.message.id,
      },
    });
  }

  const messageReadStatus = createSpan(
    ["message-status"],
    `${response.payload.message.status.isReaded ? "❇️ Read" : "⭕️ Not Read"}`
  );
  const messageBottomArea = document.querySelector(".message-bottom-area");
  if (chatArea && messageBottomArea) {
    messageBottomArea.append(messageReadStatus);
  }
}

export function showChatHistory(messages: MessagesHistoryResponse) {
  if (messages.payload.messages.length > 0) {
    const chatHistory = messages.payload.messages;
    if (state.selectedUser?.login) {
      for (const message of chatHistory) {
        receiveMessage({ message });
      }
    }
  }
}

const menu = createElement("ul", ["right-click-menu"]);
const menuItemDelete = createElement("li", ["right-click-menu_item"], "Delete");
const menuItemEdit = createElement("li", ["right-click-menu_item"], "Edit");
menu.classList.add("right-click-menu");
menu.append(menuItemDelete, menuItemEdit);
chatArea.append(menu);

menu.addEventListener("click", (event: Event) => {
  event.stopPropagation();
});

chatArea.addEventListener("contextmenu", (event: MouseEvent) => {
  event.preventDefault();
  const selectedMessageArea = (event.target as HTMLDivElement).closest(".message-area");
  if (selectedMessageArea) {
    const selectedMessageElement = selectedMessageArea as HTMLDivElement;
    menu.style.top = `${event.clientY}px`;
    menu.style.left = `${event.clientX}px`;
    menu.classList.add("right-click-menu_active");
    state.selectedMessageId = selectedMessageElement.dataset.id;
  }
});

menuItemDelete.addEventListener("click", () => {
  const selectedMessageArea = chatArea.querySelector(".message-area");
  const messageId = state.selectedMessageId;
  if (selectedMessageArea && messageId) {
    selectedMessageArea.remove();
    getMessageDelete("", {
      message: {
        id: messageId,
      },
    });
  }
  menu.classList.remove("right-click-menu_active");
});

// TODO
menuItemEdit.addEventListener("click", () => {
  menu.classList.remove("right-click-menu_active");
});
