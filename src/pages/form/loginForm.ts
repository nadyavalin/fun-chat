import { main, footer, header, logoutButton, userName, membersList } from "../chat/chat";
import { activeUser, inactiveUser, login, logout } from "../../api/api";
import { state } from "../../store/state";
import { createElement, createSnackbar } from "../../utils/elements";
import {
  ActivePayloadResponse,
  InactivePayloadResponse,
  SnackbarType,
  UserExternalPayloadResponse,
  UserLoginPayloadResponse,
  UserResponse,
} from "../../types/types";

const loginPattern = /[-a-z]{2,}$/;
const passwordPattern = /[-a-z0-9]{3,}$/;

export const formArea = createElement({ tagName: "div", classNames: ["form-area"] });

export const form = document.createElement("form");
const inputLogin = createElement({
  tagName: "input",
  classNames: ["input"],
  attributes: { type: "text", id: "login", placeholder: "Login", required: true },
});
const errorMessageForFirstName = createElement({
  tagName: "p",
  classNames: ["error-message"],
  textContent: "❌ Your login must be more than 3 characters.",
});
const inputPassword = createElement({
  tagName: "input",
  classNames: ["input"],
  attributes: { type: "password", id: "password", placeholder: "Password" },
});
const errorMessageForSurname = createElement({
  tagName: "p",
  classNames: ["error-message"],
  textContent: "❌ Your password must be more than 4 characters or/and numbers.",
});
export const loginButton = createElement({
  tagName: "button",
  textContent: "enter chat",
  attributes: { type: "submit", disabled: true },
});
export const infoButton = createElement({
  tagName: "button",
  classNames: ["button", "form-info-button"],
  textContent: "info",
  attributes: { id: "info" },
});
form.append(inputLogin, errorMessageForFirstName, inputPassword, errorMessageForSurname, loginButton);
formArea.append(form, infoButton);

function isLoginInputsNotEmpty(): boolean {
  return !!inputLogin.value.trim() && !!inputPassword.value.trim();
}

function isValidInput(inputValue: string, pattern: RegExp): boolean {
  return pattern.test(inputValue);
}

function updateButtonLoginState(): void {
  const isValid =
    isLoginInputsNotEmpty() &&
    isValidInput(inputLogin.value, loginPattern) &&
    isValidInput(inputPassword.value, passwordPattern);
  loginButton.disabled = !isValid;
  loginButton.classList.toggle("disabled", !isValid);
}

form.addEventListener("change", updateButtonLoginState);

// socket.addEventListener("open", () => {});

export function setActiveUsers(payload: ActivePayloadResponse) {
  state.authorizedUsers = payload.users;
  updateMembersList();
}

export function setInactiveUsers(payload: InactivePayloadResponse) {
  state.unauthorizedUsers = payload.users;
  updateMembersList();
}

export function updateMembersList() {
  membersList.textContent = "";
  const users = [...state.authorizedUsers, ...state.unauthorizedUsers];
  const uniqueUsers = new Map<string, UserResponse>();

  for (const user of users) {
    if (user.login === state.login) {
      continue;
    }
    uniqueUsers.set(user.login, user);
  }

  for (const user of uniqueUsers.values()) {
    const userItem = createElement({ tagName: "li", classNames: ["user-item"] });
    userItem.textContent = user.login;
    userItem.dataset.login = user.login;
    if (user.isLogined) {
      userItem.classList.add("user-item_online");
    }
    membersList.append(userItem);
  }
}

export function userLogin(payload: UserLoginPayloadResponse) {
  const snackbarUserLogin = createSnackbar(SnackbarType.success, "Пользователь успешно авторизован");
  const existingUser = state.authorizedUsers.find((user) => user.login === payload.user.login);
  if (!existingUser) {
    state.authorizedUsers.push(payload.user);
  }

  state.login = payload.user.login;
  userName.textContent = `User: ${state.login}`;
  state.authorizedUsers.push(payload.user);
  updateMembersList();

  if (state.login && state.password) {
    formArea.classList.add("form_hide");
    document.body.append(header, main, footer);
    activeUser(null);
  }
  return snackbarUserLogin;
}

export function userLogout() {
  inactiveUser(null);
  state.login = "";
  state.password = "";
  userName.textContent = "";
  state.authorizedUsers = [];
  state.unauthorizedUsers = [];

  const snackbarUserLogout = createSnackbar(SnackbarType.success, "Пользователь успешно вышел из чата");

  form.classList.remove("form_hide");
  header.remove();
  main.remove();
  footer.remove();
  updateMembersList();

  return snackbarUserLogout;
}

export function externalUserLogin(payload: UserExternalPayloadResponse) {
  state.authorizedUsers.push(payload.user);
  state.unauthorizedUsers = state.unauthorizedUsers.filter((u) => u.login !== payload.user.login);
  updateMembersList();
}

export function externalUserLogout(payload: UserExternalPayloadResponse) {
  state.unauthorizedUsers.push(payload.user);
  state.authorizedUsers = state.authorizedUsers.filter((u) => u.login !== payload.user.login);
  updateMembersList();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  state.login = inputLogin.value;
  state.password = inputPassword.value;

  login("", { user: { login: state.login, password: state.password } });
});

logoutButton.addEventListener("click", () => {
  logout("", { user: { login: state.login, password: state.password } });
  formArea.classList.remove("form_hide");
});

inputLogin.setAttribute("data-pattern", loginPattern.source);
inputPassword.setAttribute("data-pattern", passwordPattern.source);

const onBlur = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const { pattern } = input.dataset;

  if (pattern && input.value && isValidInput(input.value, new RegExp(pattern))) {
    input.classList.remove("invalid");
  } else {
    input.classList.add("invalid");
  }
  updateButtonLoginState();
};

inputLogin.addEventListener("blur", onBlur);
inputPassword.addEventListener("blur", onBlur);

const onFocus = (event: Event) => {
  (event.target as HTMLElement).classList.remove("invalid");
};

inputLogin.addEventListener("focus", onFocus);

inputPassword.addEventListener("focus", onFocus);
