import { snackbarContainer } from "../main";
import { ErrorResponse, MessageType, SnackbarType, TResponse } from "../types/types";

export function createElement<T extends keyof HTMLElementTagNameMap>({
  tagName,
  classNames,
  textContent,
  innerHTML,
  attributes,
}: {
  tagName: T;
  classNames?: string[];
  textContent?: string;
  innerHTML?: string;
  attributes?: Record<string, string>;
}): HTMLElementTagNameMap[T] {
  const element = document.createElement(tagName);

  if (classNames) {
    element.classList.add(...classNames);
  }

  if (textContent) {
    element.textContent = textContent;
  }

  if (innerHTML) {
    element.innerHTML = innerHTML;
  }

  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  }
  return element;
}

export function createInput(id: string, type: string, className: string[], placeholder: string) {
  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.name = id;
  input.classList.add(...className);
  input.placeholder = placeholder;
  input.setAttribute("required", "true");
  return input;
}

export function createButton(id: string, className: string[], text = "") {
  const button = document.createElement("button");
  button.id = id;
  button.name = id;
  button.classList.add(...className);
  button.textContent = text;
  return button;
}

export function createSubmitButton(text: string) {
  const button = createButton("submit", ["submit", "disabled"], text);
  button.type = "submit";
  button.disabled = true;
  return button;
}

export function createDiv(className: string[], data?: { key: string; value: string }) {
  const div = document.createElement("div");
  div.classList.add(...className);
  if (data && data.key && data.value) {
    div.setAttribute(`data-${data.key}`, data.value);
  }
  return div;
}

export function createSnackbar(type: SnackbarType, text: string) {
  const snackbar = createElement({
    tagName: "div",
    classNames: ["snackbar", `snackbar_${type}`],
    textContent: text,
  });
  snackbarContainer.prepend(snackbar);
  setTimeout(() => {
    snackbar.remove();
  }, 3500);
}

export function showError(payload: TResponse) {
  if (payload.type === MessageType.ERROR) {
    const errorData = (payload as ErrorResponse).payload.error;
    const snackbar = createSnackbar(SnackbarType.error, errorData);
    return snackbar;
  }
}
