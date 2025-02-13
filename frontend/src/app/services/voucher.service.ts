import {inject, Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {Observable} from 'rxjs';
import {VoucherType} from '../models/voucher-type.model';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private endpoint = '/voucher';
  private httpWrapper = inject(HttpWrapperService);

  constructor() {
  }

  createVoucher(voucherData: {}): Observable<any> {
    return this.httpWrapper.POST<any>(this.endpoint, voucherData);
  }
}
