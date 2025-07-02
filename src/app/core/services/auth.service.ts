import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ILogin, IUser, Login, Register } from '../../shared/models/user.model';
import { Observable, retry, timeout } from 'rxjs';
import { IResponse } from '../../shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private ApiEndpoint = environment.apiEndpoint;
  private ApiTimeout = environment.apiTimeout;
  private ApiRetry = environment.apiRetry;

  constructor(private http: HttpClient) {}

  register(data: Register): Observable<IResponse<IUser>> {
    return this.http
      .post<any>(`${this.ApiEndpoint}/auth/register`, data)
      .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }

  login(data: Login): Observable<IResponse<ILogin>> {
    return this.http
      .post<any>(`${this.ApiEndpoint}/auth/login`, data)
      .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }

  logout(): Observable<IResponse<any>> {
    return this.http
    .post<any>(`${this.ApiEndpoint}/auth/logout`, {})
    .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry))
  }

  loginWithGoogle() :Observable<IResponse<any>> {
    return this.http.get(`${this.ApiEndpoint}/auth/google`)
    .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry))
  }
}
