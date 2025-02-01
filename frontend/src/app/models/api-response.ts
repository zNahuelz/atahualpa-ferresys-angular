import {Deserializable} from './deserializable.entity';

export class ApiResponse implements Deserializable {
  message?: string;

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
