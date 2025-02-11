import {Deserializable} from './deserializable.entity';
import {Product} from './product.model';

export class CartHelper implements Deserializable{
  product?: Product;
  amount?: number;
  subtotal?: number;

  constructor(product?: Product, amount?: number, subtotal?: number) {
    this.product = product;
    this.amount = amount;
    this.subtotal = subtotal;
  }

  deserializable(input: any): this {
    Object.assign(this,input);
    return this;
  }
}
