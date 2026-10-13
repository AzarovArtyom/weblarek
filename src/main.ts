import "./scss/styles.scss";

import { Products } from "./components/Models/Products";
import { apiProducts } from "./utils/data";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/LarekApi";
import { API_URL } from "./utils/constants";

const productsModel = new Products();

productsModel.setItems(apiProducts.items);

console.log("Массив товаров из каталога: ", productsModel.getItems());

const firstProduct = apiProducts.items[0];

console.log("Товар по ID: ", productsModel.getItem(firstProduct.id));

productsModel.setSelectedItem(firstProduct);

console.log("Выбранный товар: ", productsModel.getSelectedItem());

const basketModel = new Basket();

const product1 = apiProducts.items[0];
const product2 = apiProducts.items[1];

basketModel.addItem(product1);
basketModel.addItem(product2);

console.log("Товары в корзине: ", basketModel.getItems());

console.log("Количество товаров: ", basketModel.getCount());

console.log("Стоимость корзины: ", basketModel.getTotal());

console.log("Товар есть в корзине: ", basketModel.hasItem(product1.id));

basketModel.removeItem(product1);
console.log("После удаления: ", basketModel.getItems());

basketModel.clear();
console.log("После очистки: ", basketModel.getItems());

const buyerModel = new Buyer();

buyerModel.setData({
  address: "Ростов, Большая Садовая 95",
});

console.log("Данные покупателя: ", buyerModel.getData());

console.log("Ошибки покупателя: ", buyerModel.validate());

buyerModel.setData({
  payment: "card",
  email: "test@yandex.ru",
  phone: "79891234567",
});

console.log("Заполненные данные: ", buyerModel.getData());

console.log("Ошибки после заполнения: ", buyerModel.validate());

buyerModel.clear();

console.log("После очистки: ", buyerModel.getData());

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

larekApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);

    console.log("Массив товаров с сервера: ", productsModel.getItems());
  })
  .catch((error) => {
    console.error("Ошибка получения товаров:", error);
  });
