import {inject, Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {Observable} from 'rxjs';
import {Customer} from '../models/customer.model';
import {PaginatedResponse} from '../models/paginated-response.entity';
import {ApiResponse} from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private endpoint = '/customer';
  private httpWrapper = inject(HttpWrapperService);
  constructor() { }

  getCustomers(): Observable<Customer[]>{
    return this.httpWrapper.GET<Customer[]>(this.endpoint);
  }

  getCustomersPaginated(page: number): Observable<PaginatedResponse<Customer>> {
    return this.httpWrapper.GET<PaginatedResponse<Customer>>(`${this.endpoint}/p?page=${page}`);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.httpWrapper.GET<Customer>(`${this.endpoint}/${id}`);
  }

  getCustomerByDni(dni: string): Observable<Customer> {
    return this.httpWrapper.GET<Customer>(`${this.endpoint}/by_dni/${dni}`);
  }

  createCustomer(customer: Customer): Observable<any> {
    return this.httpWrapper.POST<Customer>(`${this.endpoint}`, customer);
  }

  updateCustomer(customer: Customer,id: number): Observable<ApiResponse> {
    return this.httpWrapper.PUT<ApiResponse>(`${this.endpoint}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<ApiResponse> {
    return this.httpWrapper.DELETE<ApiResponse>(`${this.endpoint}/${id}`);
  }

}
