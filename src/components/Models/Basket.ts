import type { IProduct } from "../../types";
import type { IEvents } from "../base/Events";

export class Basket {
  private items: IProduct[] = [];

  constructor(private events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit("basket:changed");
  }

  removeItem(item: IProduct): void {
    this.items = this.items.filter((product) => product.id !== item.id);
    this.events.emit("basket:changed");
  }

  clear(): void {
    this.items = [];
    this.events.emit("basket:changed");
  }

  getTotal(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price ?? 0);
    }, 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
