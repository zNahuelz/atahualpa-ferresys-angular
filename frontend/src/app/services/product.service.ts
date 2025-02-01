import {inject, Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {Product} from '../models/product.model';
import {Observable} from 'rxjs';
import {PaginatedResponse} from '../models/paginated-response.entity';
import {ApiResponse} from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private endpoint = '/product';
  private httpWrapper = inject(HttpWrapperService);

  constructor() {
  }

  getProductsPaginated(page: number): Observable<PaginatedResponse<Product>> {
    return this.httpWrapper.GET<PaginatedResponse<Product>>(`${this.endpoint}?page=${page}`);
  }

  getProductsByName(name: string): Observable<Product[]> {
    return this.httpWrapper.GET<Product[]>(`${this.endpoint}/by_name/${name}`);
  }

  getProductsByUnitType(unitTypeId: number): Observable<Product[]>{
    return this.httpWrapper.GET<Product[]>(`${this.endpoint}/by_unit_type/${unitTypeId}`);
  }

  getProductsBySupplier(supplierId: number): Observable<Product[]>{
    return this.httpWrapper.GET<Product[]>(`${this.endpoint}/by_supplier/${supplierId}`);
  }

  getProductById(id: number): Observable<Product> {
    return this.httpWrapper.GET<Product>(`${this.endpoint}/${id}`);
  }

  createProduct(product: Product): Observable<any> {
    return this.httpWrapper.POST<any>(`${this.endpoint}`, product);
  }

  deleteProduct(id: number): Observable<ApiResponse>{
    return this.httpWrapper.DELETE<ApiResponse>(`${this.endpoint}/${id}`);
  }

}
