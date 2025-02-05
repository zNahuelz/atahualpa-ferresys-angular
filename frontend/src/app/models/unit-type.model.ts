import {Deserializable} from './deserializable.entity';

export class UnitType implements Deserializable {
  id?: number;
  name?: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(id?: number, name?: string, created_at?: Date, updated_at?: Date) {
    this.id = id;
    this.name = name;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  deserializable(input: any): this {
    Object.assign(this,input);
    return this;
  }
}
