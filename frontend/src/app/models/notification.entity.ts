import {Deserializable} from './deserializable.entity';

export class Notification implements Deserializable{
  message?: string;
  type?: string;
  alertIcon?: string;

constructor(message: string, type: string) {
  this.message = message;
  this.type = type;
}

  deserializable(input: any): this {
    Object.assign(this,input);
    return this;
  }
}
