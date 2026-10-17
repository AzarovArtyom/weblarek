import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Modal extends Component<{}> {
  private contentElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, onClose: () => void) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      container,
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container,
    );

    this.closeButton.addEventListener("click", onClose);

    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        onClose();
      }
    });
  }

  open(content: HTMLElement) {
    this.contentElement.replaceChildren(content);
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
  }
}
