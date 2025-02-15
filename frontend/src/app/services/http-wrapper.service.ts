import {inject, Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpWrapperService {
  constructor() {
  }

  private API_URL = 'http://localhost:8000/api';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getAuthHeaders(): HttpHeaders {
    const TOKEN = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    });
  }

  GET<T>(url: string): Observable<T> {
    return this.http
      .get<T>(`${this.API_URL}${url}`, {headers: this.getAuthHeaders()})
      .pipe(catchError(this.handleError));
  }

  GET_BLOB(url: string): Observable<Blob> {
    return this.http
      .get(`${this.API_URL}${url}`, {
        headers: this.getAuthHeaders(),
        responseType: 'blob',
      })
      .pipe(catchError(this.handleError));
  }

  POST<T>(url: string, body: any): Observable<T> {
    return this.http
      .post<T>(`${this.API_URL}${url}`, body, {headers: this.getAuthHeaders()})
      .pipe(catchError(this.handleError));
  }

  PUT<T>(url: string, body: any): Observable<T> {
    return this.http
      .put<T>(`${this.API_URL}${url}`, body, {headers: this.getAuthHeaders()})
      .pipe(catchError(this.handleError));
  }

  DELETE<T>(url: string): Observable<T> {
    return this.http
      .delete<T>(`${this.API_URL}${url}`, {headers: this.getAuthHeaders()})
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    const errorMessage = error?.message || 'Error desconocido.';
    //console.error('HTTP ERROR', error.message);
    //console.log(error);
    return throwError(() => error.error || errorMessage);
  }
}
