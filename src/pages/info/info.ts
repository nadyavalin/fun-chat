import { createElement } from "../../utils/elements";

export const infoArea = createElement({ tagName: "div", classNames: ["info-area"] });
const chatName = createElement({ tagName: "p", classNames: ["info-area__chat-name"], textContent: "Fun chat" });
const infoText = createElement({
  tagName: "p",
  classNames: ["info-text"],
  textContent:
    "The application is designed to demonstrate the Fun Chat task as part of the RSSchool JS/FE 2023Q3 course!",
});
const githubName = createElement({
  tagName: "a",
  classNames: ["github-text"],
  textContent: "nadyavalin",
  attributes: { href: "https://github.com/nadyavalin", target: "_blank" },
});
export const backButton = createElement({
  tagName: "button",
  classNames: ["back-button"],
  textContent: "Come back",
  attributes: { id: "back-button" },
});
infoArea.append(chatName, infoText, githubName, backButton);
