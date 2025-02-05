import {inject, Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {UnitType} from '../models/unit-type.model';
import {Observable} from 'rxjs';
import {PaginatedResponse} from '../models/paginated-response.entity';

@Injectable({
  providedIn: 'root'
})
export class UnitTypeService {
  private endpoint = '/unit_type';
  private httpWrapper = inject(HttpWrapperService);

  constructor() {
  }

  getUnitTypes(): Observable<UnitType[]> {
    return this.httpWrapper.GET<UnitType[]>(`${this.endpoint}`);
  }

  getUnitTypesPaginated(page: number): Observable<PaginatedResponse<UnitType>> {
    return this.httpWrapper.GET<PaginatedResponse<UnitType>>(`${this.endpoint}/p?page=${page}`);
  }

  getUnitTypeById(id: number): Observable<UnitType> {
    return this.httpWrapper.GET<UnitType>(`${this.endpoint}/${id}`);
  }

  getUnitTypeByName(name: string): Observable<UnitType[]> {
    return this.httpWrapper.GET<UnitType[]>(`${this.endpoint}/by_name/${name}`);
  }

  createUnitType(unit: UnitType): Observable<any> {
    return this.httpWrapper.POST<any>(`${this.endpoint}`, unit);
  }

  updateUnitType(unit: UnitType, id: number): Observable<any> {
    return this.httpWrapper.PUT<any>(`${this.endpoint}/${id}`, unit);
  }

}
