import { main, footer, header, logoutButton, userName, membersList } from "../chat/chat";
import { login, logout, activeUser, inactiveUser } from "../../api/api";
import { state } from "../../store/state";
import { createElement, createButton, createInput, createSnackbar, createSubmitButton } from "../../utils/elements";
import {
  ActivePayloadResponse,
  InactivePayloadResponse,
  SnackbarType,
  UserExternalPayloadResponse,
  UserLoginPayloadResponse,
} from "../../types/types";

const loginPattern = /[-a-z]{2,}$/;
const passwordPattern = /[-a-z0-9]{3,}$/;

export const formArea = createElement({ tagName: "div", classNames: ["form-area"] });

const form = document.createElement("form");
const inputLogin = createInput("login", "text", ["input"], "Login");
const errorMessageForFirstName = createElement({
  tagName: "p",
  classNames: ["error-message"],
  textContent: "❌ Your login must be more than 3 characters.",
});
const inputPassword = createInput("password", "password", ["input"], "Password");
const errorMessageForSurname = createElement({
  tagName: "p",
  classNames: ["error-message"],
  textContent: "❌ Your password must be more than 4 characters or/and numbers.",
});
export const loginButton = createSubmitButton("enter chat");
export const infoButton = createButton("info", ["button", "form-info-button"], "info");
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
}

export function setInactiveUsers(payload: InactivePayloadResponse) {
  state.unauthorizedUsers = payload.users;
}

export function updateMembersList() {
  membersList.textContent = "";
  const users = [...state.authorizedUsers, ...state.unauthorizedUsers];
  for (const user of users) {
    if (user.login === state.login) {
      continue;
    }

    const userItem = createElement({ tagName: "li", classNames: ["user-item"] });
    userItem.textContent = user.login;
    userItem.dataset.login = user.login;
    if (user.isLogged) {
      userItem.classList.add("user-item_online");
    }
    membersList.append(userItem);
  }
}

export function userLogin(payload: UserLoginPayloadResponse) {
  const snackbarUserLogin = createSnackbar(SnackbarType.success, "Пользователь успешно авторизован");
  state.login = payload.user.login;
  userName.textContent = `User: ${state.login}`;
  state.authorizedUsers.push(payload.user);
  updateMembersList();

  if (state.login && state.password) {
    formArea.classList.add("form_hide");
    document.body.append(header, main, footer);
  }
  return snackbarUserLogin;
}

export function userLogout() {
  state.id = "";
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
  state.unauthorizedUsers = state.unauthorizedUsers.filter((user) => user.login !== payload.user.login);
  updateMembersList();
}

export function externalUserLogout(payload: UserExternalPayloadResponse) {
  state.unauthorizedUsers.push(payload.user);
  state.unauthorizedUsers = state.unauthorizedUsers.filter((user) => user.login !== payload.user.login);
  updateMembersList();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  state.login = inputLogin.value;
  state.password = inputPassword.value;

  activeUser("");
  inactiveUser("");
  login("", { user: { login: state.login, password: state.password } });
});

logoutButton.addEventListener("click", () => {
  logout("", { user: { login: state.login, password: state.password } });
  formArea.classList.remove("form_hide");
});

inputLogin.dataset.pattern = loginPattern.source;
inputPassword.dataset.pattern = passwordPattern.source;

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

export default form;
