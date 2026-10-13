import type { IApi, IProductsResponse, IOrder, IOrderResponse } from "../types";

export class LarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>("/product/");
  }

  postOrder(data: IOrder): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order/", data);
  }
}
