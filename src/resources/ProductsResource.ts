import Resource from './Resource';
export interface IProduct {
  _id: string;
  nombre: string;
  cantidad: number;
  precio: number;
  uri_photo?: string;
  path_photo?: string;
}

export interface INewProduct {
  nombre: string;
  cantidad: number;
  precio: number;
  uri_photo?: string;
  path_photo?: string;
}
export interface IUpdateProduct {
  _id?: string;
  nombre?: string;
  cantidad?: number;
  precio?: number;
  uri_photo?: string;
  path_photo?: string;
}

export default class ProductsResource extends Resource<
  IProduct,
  INewProduct,
  IUpdateProduct
> {
  constructor(sesionToken: string) {
    super('products', sesionToken);
  }
}
