
import {Deserializable} from './deserializable.entity';

export class Supplier  implements Deserializable{
  id?: number;
  name?: string;
  ruc?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  visible?: boolean;

  constructor(name?: string, ruc?: string, address?: string, phone?: string, email?: string, description?: string, visible?: boolean) {
    this.name = name;
    this.ruc = ruc;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.description = description;
    this.visible = visible;
  }
  deserializable(input: any): this {
    Object.assign(this,input);
    return this;
  }
}
