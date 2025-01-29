
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
  deserializable(input: any): this {
    Object.assign(this,input);
    return this;
  }
}
