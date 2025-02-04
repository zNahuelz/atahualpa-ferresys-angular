import {inject, Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {Observable} from 'rxjs';
import {Supplier} from '../models/supplier.model';
import {PaginatedResponse} from '../models/paginated-response.entity';
import {ApiResponse} from '../models/api-response';

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

  getSuppliersPaginated(page: number): Observable<PaginatedResponse<Supplier>>{
    return this.httpWrapper.GET<PaginatedResponse<Supplier>>(`${this.endpoint}/p?page=${page}`);
  }

  getSupplierById(id: number): Observable<Supplier> {
    return this.httpWrapper.GET<Supplier>(`${this.endpoint}/${id}`);
  }

  getSupplierByRuc(ruc: string): Observable<Supplier> {
    return this.httpWrapper.GET<Supplier>(`${this.endpoint}/by_ruc/${ruc}`);
  }

  getSuppliersByName(name: string): Observable<Supplier[]> {
    return this.httpWrapper.GET(`${this.endpoint}/by_name/${name}`);
  }

  createSupplier(supplier: Supplier): Observable<any> {
    return this.httpWrapper.POST(`${this.endpoint}`,supplier);
  }

  deleteSupplier(id: number): Observable<ApiResponse> {
    return this.httpWrapper.DELETE(`${this.endpoint}/${id}`);
  }
}
