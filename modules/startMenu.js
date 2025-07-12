import { elements } from "./config.js";
import { initGame } from "./initgame.js";

export function StartMenu() {
  elements.start.addEventListener("click", (evt) => {
    document.body.removeChild(elements.blurr);
    elements.blurr.style.display = "none";
    initGame(); // This will internally call everything else
  });

  document.addEventListener("keydown", (evt) => {
    if (evt.key == "Enter") {
      document.body.removeChild(elements.blurr);
      initGame(); // This will internally call everything else
    }
  });
}
