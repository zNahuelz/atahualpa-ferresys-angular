import {inject, Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {Observable} from 'rxjs';
import {Supplier} from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private endpoint = '/supplier';
  private httpWrapper = inject(HttpWrapperService);
  constructor() { }

  getSuppliers(): Observable<Supplier[]>{
    return this.httpWrapper.GET<Supplier[]>(`${this.endpoint}`);
  }
}
