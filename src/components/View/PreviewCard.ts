import { Card } from "./Card";
import { IProduct } from "../../types";
import { CDN_URL, categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

type TPreviewCard = Pick<
  IProduct,
  "title" | "price" | "category" | "image" | "description"
> & {
  buttonText: string;
  buttonDisabled: boolean;
};

export class PreviewCard extends Card<TPreviewCard> {
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;
  private descriptionElement: HTMLElement;
  private actionButton: HTMLButtonElement;

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

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      container,
    );

    this.actionButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      container,
    );

    this.actionButton.addEventListener("click", onClick);
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

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.actionButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.actionButton.disabled = value;
  }
}
