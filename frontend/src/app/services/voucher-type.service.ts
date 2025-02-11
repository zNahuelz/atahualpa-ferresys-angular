import {inject, Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {VoucherType} from '../models/voucher-type.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoucherTypeService {
  private endpoint = '/voucher_type';
  private httpWrapper = inject(HttpWrapperService);

  constructor() {
  }

  getVoucherTypes(): Observable<VoucherType[]> {
    return this.httpWrapper.GET<VoucherType[]>(`${this.endpoint}`);
  }
}
