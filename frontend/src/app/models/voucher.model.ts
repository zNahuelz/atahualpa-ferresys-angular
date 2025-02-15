import {Deserializable} from './deserializable.entity';
import {VoucherType} from './voucher-type.model';
import {Customer} from './customer.model';
import {VoucherDetail} from './voucher-detail.model';

export class Voucher implements Deserializable {
  id?: number;
  subtotal?: number;
  igv?: number;
  total?: number;
  paid?: boolean;
  voucher_type?: VoucherType;
  customer_id?: number;
  customer?: Customer;
  voucher_detail?: VoucherDetail[];
  created_at?: Date;
  updated_at?: Date;

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
