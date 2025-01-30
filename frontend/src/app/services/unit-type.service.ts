import {inject, Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {UnitType} from '../models/unit-type';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitTypeService {
  private endpoint = '/unit_type';
  private httpWrapper = inject(HttpWrapperService);
  constructor() { }

  getUnitTypes(): Observable<UnitType[]>{
    return this.httpWrapper.GET<UnitType[]>(`${this.endpoint}`);
  }
}
