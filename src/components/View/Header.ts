import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  private basketButton: HTMLButtonElement;
  private counterElement: HTMLElement;

  constructor(container: HTMLElement, onBasketClick: () => void) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      container,
    );

    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      container,
    );

    this.basketButton.addEventListener("click", onBasketClick);
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
