import Resource from './Resource';
export interface IOrderProduct {
  _id: string;
  cant_compra: number;
  nombre: string;
  precio: number;
  cant_stock: number;
}

export interface IOrder {
  _id: string;
  client_id: string;
  user_id: string;
  products?: Array<IOrderProduct>;
  estado_pago: boolean;
  metodo_pago?: string;
  estado_pedido: string;
  fecha_entrega?: Date;
  fecha_pedido: Date;
  total_pedido?: number;
  motivo_no_pedido?: string;
}

export interface INewOrder {
  client_id: string;
  user_id: string;
  products?: Array<IOrderProduct>;
  estado_pago: boolean;
  metodo_pago?: string;
  estado_pedido: string;
  fecha_entrega?: Date;
  fecha_pedido?: Date;
  total_pedido?: number;
  motivo_no_pedido?: string;
}

export interface IUpdateOrder {
  _id?: string;
  client_id?: string;
  user_id?: string;
  products?: Array<IOrderProduct>;
  estado_pago?: boolean;
  metodo_pago?: string;
  estado_pedido?: string;
  fecha_entrega?: Date;
  fecha_pedido?: Date;
  total_pedido?: number;
  motivo_no_pedido?: string;
}

export default class OrdersResource extends Resource<
  IOrder,
  INewOrder,
  IUpdateOrder
> {
  constructor(sesionToken: string) {
    super('orders', sesionToken);
  }
}
