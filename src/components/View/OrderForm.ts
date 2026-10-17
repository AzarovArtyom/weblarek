import { Form, IFormView } from "./Form";
import { TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";

interface IOrderFormView extends IFormView {
  payment: TPayment | null;
  address: string;
}

export class OrderForm extends Form<IOrderFormView> {
  private cardButton: HTMLButtonElement;
  private cashButton: HTMLButtonElement;
  private addressInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    onInput: (field: string, value: string) => void,
    onSubmit: () => void,
  ) {
    super(container, onInput, onSubmit);

    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      container,
    );

    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      container,
    );

    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container,
    );

    this.cardButton.addEventListener("click", () => {
      onInput("payment", "card");
    });

    this.cashButton.addEventListener("click", () => {
      onInput("payment", "cash");
    });
  }

  set payment(value: TPayment | null) {
    this.cardButton.classList.toggle("button_alt-active", value === "card");

    this.cashButton.classList.toggle("button_alt-active", value === "cash");
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
