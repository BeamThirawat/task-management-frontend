import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ILogin, IUser, Login, Register } from '../../shared/models/user.model';
import { BehaviorSubject, Observable, retry, timeout } from 'rxjs';
import { IResponse } from '../../shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private ApiEndpoint = environment.apiEndpoint;
  private ApiTimeout = environment.apiTimeout;
  private ApiRetry = environment.apiRetry;

  constructor(private http: HttpClient) {}

  private currentUserSubject = new BehaviorSubject<ILogin | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  setCurrentUser(user: ILogin) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): ILogin | null {
    return this.currentUserSubject.value;
  }

  register(data: Register): Observable<IResponse<IUser>> {
    return this.http
      .post<any>(`${this.ApiEndpoint}/auth/register`, data)
      .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }

  login(data: Login): Observable<IResponse<ILogin>> {
    return this.http
      .post<any>(`${this.ApiEndpoint}/auth/login`, data, {
        withCredentials: true,
      })
      .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }

  logout(): Observable<IResponse<any>> {
    return this.http
      .post<any>(`${this.ApiEndpoint}/auth/logout`, {}, {withCredentials: true})
      .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }

  loginWithGoogle(): void {
    const redirectUri = encodeURIComponent('http://localhost:4200/dashboard');
    const url = `${this.ApiEndpoint}/auth/google?redirect_uri=${redirectUri}`;
    window.location.href = url;
  }

  checkCurrentUser(): Observable<IResponse<any>> {
    return this.http
      .get<any>(`${this.ApiEndpoint}/auth/me`, {
        withCredentials: true,
      })
      .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }
}
