import {Deserializable} from './deserializable.entity';
import {Role} from './role.model';

export class User implements Deserializable {
  id?: number;
  username?: string;
  name?: string;
  paternal_surname?: string;
  maternal_surname?: string;
  email?: string;
  phone?: string;
  role?: Role;
  created_at?: Date;
  updated_at?: Date;

  deserializable(input: any): this {
    Object.assign(this,input);
    return this;
  }
}


