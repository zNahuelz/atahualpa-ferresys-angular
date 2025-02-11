import {Deserializable} from './deserializable.entity';

export class VoucherType implements Deserializable{
  id?: number;
  name?: string;
  created_at?: Date;
  updated_at?: Date;

  deserializable(input: any): this {
    Object.assign(this,input);
    return this;
  }
}
