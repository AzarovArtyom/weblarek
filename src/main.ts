import "./scss/styles.scss";

import { Products } from "./components/Models/Products";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/LarekApi";
import { EventEmitter } from "./components/base/Events";
import { API_URL } from "./utils/constants";

import { Gallery } from "./components/View/Gallery";
import { CatalogCard } from "./components/View/CatalogCard";
import { cloneTemplate, ensureElement } from "./utils/utils";

import { PreviewCard } from "./components/View/PreviewCard";
import { Modal } from "./components/View/Modal";

import { Basket } from "./components/Models/Basket";
import { Header } from "./components/View/Header";

import { BasketView } from "./components/View/BasketView";
import { BasketCard } from "./components/View/BasketCard";

import { Buyer } from "./components/Models/Buyer";
import { OrderForm } from "./components/View/OrderForm";

import { ContactsForm } from "./components/View/ContactsForm";

import { Success } from "./components/View/Success";
import type { IOrder } from "./types";

const events = new EventEmitter();

const productsModel = new Products(events);

const basketModel = new Basket(events);

const buyerModel = new Buyer(events);

const header = new Header(
  ensureElement<HTMLElement>(".header"),
  events.trigger("basket:open"),
);

header.render({ counter: 0 });

events.on("basket:changed", () => {
  header.render({
    counter: basketModel.getCount(),
  });

  renderBasket();
});

const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));

const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), () =>
  events.emit("modal:close"),
);

const basketView = new BasketView(cloneTemplate<HTMLElement>("#basket"), () =>
  events.emit("basket:order"),
);

const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>("#order"),
  (field, value) => {
    events.emit("buyer:change", { field, value });
  },
  () => {
    events.emit("order:submit");
  },
);

const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>("#contacts"),
  (field, value) => {
    events.emit("buyer:change", { field, value });
  },
  () => {
    events.emit("contacts:submit");
  },
);

const success = new Success(cloneTemplate<HTMLElement>("#success"), () =>
  events.emit("success:close"),
);

events.on<{ field: string; value: string }>("buyer:change", (data) => {
  if (data.field === "payment") {
    if (data.value === "card" || data.value === "cash") {
      buyerModel.setData({ payment: data.value });
    }
  }

  if (data.field === "address") {
    buyerModel.setData({ address: data.value });
  }

  if (data.field === "email") {
    buyerModel.setData({ email: data.value });
  }

  if (data.field === "phone") {
    buyerModel.setData({ phone: data.value });
  }
});

const renderOrderForm = () => {
  const data = buyerModel.getData();
  const errors = buyerModel.validate();

  const formErrors = [errors.payment, errors.address]
    .filter(Boolean)
    .join("; ");

  orderForm.render({
    payment: data.payment,
    address: data.address,
    valid: !errors.payment && !errors.address,
    errors: formErrors,
  });
};

const renderContactsForm = () => {
  const data = buyerModel.getData();
  const errors = buyerModel.validate();

  const formErrors = [errors.email, errors.phone].filter(Boolean).join("; ");

  return contactsForm.render({
    email: data.email,
    phone: data.phone,
    valid: !errors.email && !errors.phone,
    errors: formErrors,
  });
};

events.on("buyer:changed", () => {
  renderOrderForm();
  renderContactsForm();
});

events.on("basket:order", () => {
  renderOrderForm();
  modal.open(orderForm.render());
});

events.on("order:submit", () => {
  modal.open(renderContactsForm());
});

events.on("contacts:submit", () => {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();

  if (Object.keys(errors).length > 0 || !buyerData.payment) {
    return;
  }

  const order: IOrder = {
    ...buyerData,
    payment: buyerData.payment,
    total: basketModel.getTotal(),
    items: basketModel.getItems().map((item) => item.id),
  };

  larekApi
    .postOrder(order)
    .then((response) => {
      basketModel.clear();
      buyerModel.clear();

      modal.open(
        success.render({
          total: response.total,
        }),
      );
    })
    .catch((error) => {
      console.error("Ошибка оформления заказа:", error);
    });
});

events.on("success:close", () => {
  modal.close();
});

const renderBasket = () => {
  const items = basketModel.getItems();

  const cards = items.map((product, index) => {
    const card = new BasketCard(
      cloneTemplate<HTMLLIElement>("#card-basket"),
      () => events.emit("basket:remove", { id: product.id }),
    );

    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  basketView.render({
    items: cards,
    total: basketModel.getTotal(),
    orderDisabled: basketModel.getCount() === 0,
  });
};

events.on("basket:open", () => {
  renderBasket();
  modal.open(basketView.render());
});

events.on<{ id: string }>("basket:remove", (data) => {
  const product = basketModel.getItems().find((item) => item.id === data.id);

  if (product) {
    basketModel.removeItem(product);
  }
});

events.on<{ id: string }>("card:select", (data) => {
  const product = productsModel.getItem(data.id);

  if (product) {
    productsModel.setSelectedItem(product);
  }
});

events.on("product:selected", () => {
  const product = productsModel.getSelectedItem();

  if (!product) {
    return;
  }

  const previewCard = new PreviewCard(
    cloneTemplate<HTMLElement>("#card-preview"),
    () => events.emit("card:action", { id: product.id }),
  );

  const cardElement = previewCard.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    description: product.description,
    buttonText:
      product.price === null
        ? "Недоступно"
        : basketModel.hasItem(product.id)
          ? "Удалить из корзины"
          : "Купить",
    buttonDisabled: product.price === null,
  });

  modal.open(cardElement);
});

events.on<{ id: string }>("card:action", (data) => {
  const product = productsModel.getItem(data.id);

  if (!product || product.price === null) {
    return;
  }

  if (basketModel.hasItem(product.id)) {
    basketModel.removeItem(product);
  } else {
    basketModel.addItem(product);
  }

  modal.close();
});

events.on("modal:close", () => {
  modal.close();
});

events.on("products:changed", () => {
  const products = productsModel.getItems();

  const cards = products.map((product) => {
    const card = new CatalogCard(
      cloneTemplate<HTMLButtonElement>("#card-catalog"),
      () => events.emit("card:select", { id: product.id }),
    );

    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
    });
  });

  gallery.render({ items: cards });
});

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

larekApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
  })
  .catch((error) => {
    console.error("Ошибка получения товаров:", error);
  });
