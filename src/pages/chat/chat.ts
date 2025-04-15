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
import { createElement } from "../../utils/elements";

export const header = createElement({ tagName: "header", classNames: ["header"] });
export const main = createElement({ tagName: "main", classNames: ["main"] });
export const footer = createElement({ tagName: "footer", classNames: ["footer"] });

const leftSide = createElement({ tagName: "div", classNames: ["left-side"] });
const search = createElement({ tagName: "div", classNames: ["left-side__search"] });
export const membersList = createElement({ tagName: "ul", classNames: ["left-side__member-list"] });
export const unreadMessage = createElement({ tagName: "span", classNames: ["unread-message"], textContent: `` });

const rightSide = createElement({ tagName: "div", classNames: ["right-side"] });
const statusArea = createElement({ tagName: "div", classNames: ["right-side__status-area"] });
const chatArea = createElement({ tagName: "div", classNames: ["right-side__chat-area"] });
const sendMessageFormArea = createElement({ tagName: "form", classNames: ["right-side__send-message-area"] });

leftSide.append(search, membersList);
rightSide.append(statusArea, chatArea, sendMessageFormArea);
main.append(leftSide, rightSide);

const headerText = createElement({ tagName: "div", classNames: ["header-text"] });

export const userName = createElement({ tagName: "p", classNames: ["user-name"], textContent: `` });
const chatName = createElement({ tagName: "p", classNames: ["chat-name"], textContent: "Fun Chat" });
const headerButtons = createElement({ tagName: "div", classNames: ["header-buttons"] });
export const logoutButton = createElement({
  tagName: "button",
  classNames: ["logout-button"],
  textContent: "logout",
  attributes: { id: "logout" },
});
const infoButton = createElement({
  tagName: "button",
  classNames: ["info-button"],
  textContent: "info",
  attributes: { id: "info" },
});
headerButtons.append(logoutButton, infoButton);
headerText.append(userName, chatName, headerButtons);
header.append(headerText);

const searchInput = createElement({
  tagName: "input",
  classNames: ["search-input"],
  attributes: { id: "search-input", type: "text", placeholder: "Search..." },
});
const searchButton = createElement({
  tagName: "button",
  classNames: ["search-button"],
  textContent: "Search",
  attributes: { id: "search-button" },
});
search.append(searchInput, searchButton);

const chatAreaText = createElement({
  tagName: "p",
  classNames: ["chat-area__text"],
  textContent: "Write your first message...",
});
chatArea.append(chatAreaText);

const messageInput = createElement({
  tagName: "input",
  classNames: ["send-message-input"],
  attributes: { id: "send-message-input", type: "text", placeholder: "Message..." },
});
const sendButton = createElement({
  tagName: "button",
  classNames: ["send-button"],
  textContent: "send",
  attributes: { id: "send-button" },
});
sendMessageFormArea.append(messageInput, sendButton);

const footerText = createElement({ tagName: "p", classNames: ["footer-text"] });
const logoRSSchool = createElement({
  tagName: "img",
  classNames: ["logo"],
  attributes: { src: "/img/logo.png", alt: "RSSchool" },
});
const rsSchool = createElement({
  tagName: "a",
  classNames: ["rsschool-text"],
  attributes: { href: "https://rs.school/courses", target: "_blank" },
});
const githubName = createElement({
  tagName: "a",
  classNames: ["github-text"],
  textContent: "nadyavalin",
  attributes: { href: "https://github.com/nadyavalin" },
});
const year = createElement({ tagName: "p", classNames: ["year-text"], textContent: "2024" });
rsSchool.append(logoRSSchool);
footerText.append(rsSchool, githubName, year);
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
      const chosenUserFromList = createElement({ tagName: "p", classNames: ["chosen-user"], textContent: login });
      const userStatus = createElement({ tagName: "p", classNames: ["user-status"], textContent: status });
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
    const messageArea = createElement({
      tagName: "div",
      classNames: ["message-area"],
      attributes: { key: "id", value: payload.message.id },
    });
    const messageTopArea = createElement({ tagName: "div", classNames: ["message-top-area"] });
    const messageBottomArea = createElement({ tagName: "div", classNames: ["message-bottom-area"] });
    const messageFrom = createElement({
      tagName: "span",
      classNames: ["message-from"],
      textContent: `${payload.message.from}`,
    });
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
    const messageDate = createElement({
      tagName: "span",
      classNames: ["message-date"],
      textContent: formattedDateTime,
    });
    const messageText = createElement({
      tagName: "p",
      classNames: ["message-text"],
      textContent: `${payload.message.text}`,
    });

    messageTopArea.append(messageFrom, messageDate);
    messageArea.append(messageTopArea, messageText, messageBottomArea);
    chatAreaText.append(messageArea);
  }
}

// TODO
export function showDeliveredMessageStatus(response: MessageDeliveredStatusRequestFromServer) {
  const messageId = response.payload.message.id;
  const messageArea = chatArea.querySelector(`.message-area[data-id="${messageId}"]`);
  const messageDeliveredStatus = createElement({
    tagName: "span",
    classNames: ["message-status"],
    textContent: `${response.payload.message.status.isDelivered ? "✅ Delivered" : "❌ Not Delivered"}`,
  });

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

  const messageReadStatus = createElement({
    tagName: "span",
    classNames: ["message-status"],
    textContent: `${response.payload.message.status.isRead ? "❇️ Read" : "⭕️ Not Read"}`,
  });
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

const menu = createElement({ tagName: "ul", classNames: ["right-click-menu"] });
const menuItemDelete = createElement({ tagName: "li", classNames: ["right-click-menu_item"], textContent: "Delete" });
const menuItemEdit = createElement({ tagName: "li", classNames: ["right-click-menu_item"], textContent: "Edit" });
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
