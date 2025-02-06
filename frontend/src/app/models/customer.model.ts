import {Deserializable} from './deserializable.entity';

export class Customer implements Deserializable {
  id?: number;
  name?: string;
  surname?: string;
  dni?: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;

  constructor(name?: string, surname?: string, dni?: string, address?: string, phone?: string, email?: string) {
    this.name = name;
    this.surname = surname;
    this.dni = dni;
    this.address = address;
    this.phone = phone;
    this.email = email;
  }

  deserializable(input: any): this {
    Object.assign(this,input);
    return this;
  }
}
