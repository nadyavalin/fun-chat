import "./style.css";
import "./pages/chat/chat.css";
import "./pages/form/loginForm.css";
import "./pages/info/info.css";

import { state } from "./store/state";
import { infoButton, formArea } from "./pages/form/loginForm";
import { backButton, infoArea } from "./pages/info/info";
import { footer, header, main } from "./pages/chat/chat";

document.body.append(formArea);
document.body.classList.add("body-chat");

infoButton.addEventListener("click", () => {
  formArea.classList.add("form_hide");
  document.body.append(infoArea);
});

backButton.addEventListener("click", () => {
  infoArea.remove();
  if (state.login) {
    document.body.append(header, main, footer);
  } else {
    formArea.classList.remove("form_hide");
  }
});
