import {Deserializable} from './deserializable.entity';
import {UnitType} from './unit-type';

export class Product implements Deserializable {
  id?: number;
  name?: string;
  description?: string;
  buy_price?: number;
  sell_price?: number;
  stock?: number;
  visible?: boolean;
  supplier_id?: number;
  created_at?: Date;
  updated_at?: Date;
  unit_type?: UnitType;

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
