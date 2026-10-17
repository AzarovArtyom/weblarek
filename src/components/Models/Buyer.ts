import type { IBuyer, IBuyerErrors } from "../../types";
import type { IEvents } from "../base/Events";

export class Buyer {
  private data: IBuyer = {
    payment: null,
    email: "",
    phone: "",
    address: "",
  };

  constructor(private events: IEvents) {}

  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
    this.events.emit("buyer:changed");
  }

  getData(): IBuyer {
    return this.data;
  }

  clear(): void {
    this.data = {
      payment: null,
      email: "",
      phone: "",
      address: "",
    };
    this.events.emit("buyer:changed");
  }

  validate(): IBuyerErrors {
    const errors: IBuyerErrors = {};

    if (!this.data.payment) {
      errors.payment = "Выберите способ оплаты";
    }

    if (!this.data.address?.trim()) {
      errors.address = "Укажите адрес доставки";
    }

    if (!this.data.email?.trim()) {
      errors.email = "Укажите email";
    }

    if (!this.data.phone?.trim()) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }
}
