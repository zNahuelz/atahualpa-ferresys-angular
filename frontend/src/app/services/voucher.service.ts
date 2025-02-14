import {inject, Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {Observable} from 'rxjs';
import {VoucherType} from '../models/voucher-type.model';
import {PaginatedResponse} from '../models/paginated-response.entity';
import {Voucher} from '../models/voucher.model';

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

  getVouchersByMonth(page: number, date?: string): Observable<PaginatedResponse<Voucher>> {
    return this.httpWrapper.GET<PaginatedResponse<Voucher>>(`${this.endpoint}/by_month?date=${date}&page=${page}`);
  }

  getVouchersByCustomerDni(page: number, dni: string): Observable<PaginatedResponse<Voucher>> {
    return this.httpWrapper.GET<PaginatedResponse<Voucher>>(`${this.endpoint}/by_dni/${dni}&page=${page}`);
  }

  getVouchersByRange(page: number, startDate: string, endDate: string): Observable<PaginatedResponse<Voucher>> {
    return this.httpWrapper.GET<PaginatedResponse<Voucher>>(`${this.endpoint}/by_range?startDate=${startDate}&endDate=${endDate}&page=${page}`);
  }

}
