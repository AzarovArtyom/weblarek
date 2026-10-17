import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IFormView {
  valid: boolean;
  errors: string;
}

export class Form<T extends IFormView = IFormView> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(
    container: HTMLFormElement,
    onInput: (field: string, value: string) => void,
    onSubmit: () => void,
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container,
    );

    this.errorsElement = ensureElement<HTMLElement>(".form__errors", container);

    container.addEventListener("input", (event) => {
      const target = event.target;

      if (target instanceof HTMLInputElement) {
        onInput(target.name, target.value);
      }
    });

    container.addEventListener("submit", (event) => {
      event.preventDefault();
      onSubmit();
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
