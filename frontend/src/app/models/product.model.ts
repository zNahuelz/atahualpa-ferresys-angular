import {Deserializable} from './deserializable.entity';
import {UnitType} from './unit-type.model';
import {Supplier} from './supplier.model';

export class Product implements Deserializable {
  id?: number;
  name?: string;
  description?: string;
  buy_price?: number;
  sell_price?: number;
  stock?: number;
  visible?: boolean;
  supplier_id?: number;
  unit_type_id?: number;
  created_at?: Date;
  updated_at?: Date;
  unit_type?: UnitType;
  supplier?: Supplier;

  constructor(name?: string, description?: string, buyPrice?: number, sellPrice?: number, stock?: number, supplier?: number, unitType?: number, visible?: boolean ) {
    this.name = name;
    this.description = description;
    this.buy_price = buyPrice;
    this.sell_price = sellPrice;
    this.stock = stock;
    this.supplier_id = supplier;
    this.unit_type_id = unitType;
    this.visible = visible;
  }

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
