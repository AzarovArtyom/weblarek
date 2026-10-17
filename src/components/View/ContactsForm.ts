import { Form, IFormView } from "./Form";
import { ensureElement } from "../../utils/utils";

interface IContactsFormView extends IFormView {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormView> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    onInput: (field: string, value: string) => void,
    onSubmit: () => void,
  ) {
    super(container, onInput, onSubmit);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container,
    );

    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container,
    );
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
