import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IBasketView {
  items: HTMLElement[];
  total: number;
  orderDisabled: boolean;
}

export class BasketView extends Component<IBasketView> {
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, onOrder: () => void) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(".basket__list", container);

    this.totalElement = ensureElement<HTMLElement>(".basket__price", container);

    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container,
    );

    this.orderButton.addEventListener("click", onOrder);
  }

  set items(items: HTMLElement[]) {
    if (items.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "Корзина пуста";
      this.listElement.replaceChildren(empty);
    } else {
      this.listElement.replaceChildren(...items);
    }
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set orderDisabled(value: boolean) {
    this.orderButton.disabled = value;
  }
}
