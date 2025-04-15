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
  attributes?: Record<string, string | boolean>;
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
      if (typeof value === "boolean") {
        if (value) {
          element.setAttribute(key, "");
        }
      } else {
        element.setAttribute(key, value);
      }
    }
  }
  return element;
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
