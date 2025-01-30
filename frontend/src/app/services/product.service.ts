import {inject, Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {Product} from '../models/product.model';
import {Observable} from 'rxjs';
import {PaginatedResponse} from '../models/paginated-response.entity';

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

  getProductsByName(name: string, page?: number): Observable<PaginatedResponse<Product>> {
    return this.httpWrapper.GET<PaginatedResponse<Product>>(`${this.endpoint}/by_name/${name}?page=${page}`);
  }

  createProduct(product: Product): Observable<any> {
    return this.httpWrapper.POST<any>(`${this.endpoint}`, product);
  }

}
