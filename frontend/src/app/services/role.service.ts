import {inject, Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {Role} from '../models/role.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private endpoint = '/role';
  private httpWrapper = inject(HttpWrapperService);
  constructor() { }

  getRoles(): Observable<Role[]>{
    return this.httpWrapper.GET<Role[]>(`${this.endpoint}`);
  }

}
