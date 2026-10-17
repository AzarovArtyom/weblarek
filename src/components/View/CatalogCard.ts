import { Card } from "./Card";
import { IProduct } from "../../types";
import { CDN_URL, categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

type TCatalogCard = Pick<IProduct, "title" | "price" | "category" | "image">;

export class CatalogCard extends Card<TCatalogCard> {
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      container,
    );

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );

    container.addEventListener("click", onClick);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    const categoryClass = categoryMap[value as keyof typeof categoryMap];

    this.categoryElement.className =
      `card__category ${categoryClass ?? ""}`.trim();
  }

  set image(value: string) {
    this.setImage(this.imageElement, `${CDN_URL}${value}`);
  }
}
