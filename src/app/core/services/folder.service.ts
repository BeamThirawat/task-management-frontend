import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, retry, timeout } from 'rxjs';
import { IResponse } from '../../shared/models/response.model';
import { Folder, GetFolder, IFolder } from '../../shared/models/folder.model';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private ApiEndpoint = environment.apiEndpoint;
  private ApiTimeout = environment.apiTimeout;
  private ApiRetry = environment.apiRetry;

  constructor(private http: HttpClient) {}

  getFolders(): Observable<IResponse<IFolder>> {
    return this.http
      .get<any>(`${this.ApiEndpoint}/folder-management/getFolders`, {
        withCredentials: true,
      })
      .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }

  getFolder(id: GetFolder): Observable<IResponse<IFolder>> {
    return this.http
      .get<any>(`${this.ApiEndpoint}/folder-management/getFolders`, {
        withCredentials: true,
      })
      .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }

  AddFolder(data: Folder): Observable<IResponse<IFolder>> {
    return this.http
      .post<any>(`${this.ApiEndpoint}/folder-management/addFolder`, data, {
        withCredentials: true,
      })
      .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }

  EditFolder(data: Folder, id: number): Observable<IResponse<IFolder>> {
    return this.http
      .post<any>(`${this.ApiEndpoint}/folder-management/editFolder?id=${id}`, data, {
        withCredentials: true,
      })
      .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }

  deleteFolder(id: number): Observable<IResponse<any>> {
    return this.http.delete<any>(`${this.ApiEndpoint}/folder-management/deleteFolder?id=${id}`, {
      withCredentials: true
    })
    .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }
}
