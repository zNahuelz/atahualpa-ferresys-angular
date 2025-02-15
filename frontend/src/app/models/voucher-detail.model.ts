import {Deserializable} from './deserializable.entity';
import {Product} from './product.model';

export class VoucherDetail implements Deserializable{
  id?: number;
  product_id?: number;
  voucher_id?: number;
  amount?: number;
  product?: Product;
  unit_price?: number;
  subtotal?: number;
  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
