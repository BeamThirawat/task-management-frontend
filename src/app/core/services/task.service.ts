import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  retry,
  timeout,
} from 'rxjs';
import { IResponse } from '../../shared/models/response.model';
import { ITask, Task } from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private ApiEndpoint = environment.apiEndpoint;
  private ApiTimeout = environment.apiTimeout;
  private ApiRetry = environment.apiRetry;
  private tasksSubject = new BehaviorSubject<ITask[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadTasks(): void {
    this.http
      .get<IResponse<ITask[]>>(`${this.ApiEndpoint}/task-management/getTasks`, {
        withCredentials: true,
      })
      .pipe(
        timeout(this.ApiTimeout),
        retry(this.ApiRetry),
        map((res) => res.data ?? []),
        catchError((error) => {
          this.tasksSubject.next([]);
          return of([]);
        })
      )
      .subscribe((tasks) => {
        this.tasksSubject.next(tasks);
      });
  }

  loadTaskByFolder(folderId: number): Observable<IResponse<ITask[]>> {
    return this.http
      .get<any>(`${this.ApiEndpoint}/task-management/getTasks?folderId=${folderId}`, {
        withCredentials: true,
      })
      .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }

  getTask(): Observable<IResponse<ITask>> {
    return this.http
      .get<any>(`${this.ApiEndpoint}/task-management/getTask`, {
        withCredentials: true,
      })
      .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }

  AddTask(data: Task): Observable<IResponse<ITask>> {
    return this.http
      .post<any>(`${this.ApiEndpoint}/task-management/addTask`, data, {
        withCredentials: true,
      })
      .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }

  EditTask(data: Task, id: number): Observable<IResponse<ITask>> {
    return this.http
      .post<any>(
        `${this.ApiEndpoint}/task-management/editTask?id=${id}`,
        data,
        {
          withCredentials: true,
        }
      )
      .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }

  deleteTask(id: number): Observable<IResponse<any>> {
    return this.http
      .delete<any>(`${this.ApiEndpoint}/task-management/deleteTask?id=${id}`, {
        withCredentials: true,
      })
      .pipe(timeout(this.ApiTimeout), retry(this.ApiRetry));
  }
}
