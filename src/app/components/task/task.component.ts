import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TaskService } from '../../core/services/task.service';
import { ITask } from '../../shared/models/task.model';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import Swal from 'sweetalert2';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-task',
  imports: [
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    TranslateModule,
    NgFor,
    DatePipe,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzSelectModule,
    DragDropModule,
    NzAlertModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
  providers: [DatePipe],
})
export class TaskComponent implements OnInit {
  folderId: number = 0;
  folderName: string = '';
  tasks: ITask[] = [];
  todoTasks: ITask[] = [];
  inProgressTasks: ITask[] = [];
  doneTasks: ITask[] = [];
  taskStatusCount: Record<string, number> = {};
  isModalVisible: boolean = false;
  taskForm!: FormGroup;
  isloading: boolean = false;
  isEditMode: boolean = false;
  taskId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.folderId = Number(this.route.snapshot.paramMap.get('id'));
    this.folderName = this.route.snapshot.paramMap.get('projectName') ?? '';
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      startDate: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });

    this.getTasks();
  }

  getTasks() {
    this.taskService.loadTaskByFolder(this.folderId).subscribe({
      next: (res) => {
        if (res.message?.toLowerCase() === 'success') {
          this.tasks = res.data as ITask[];
          this.taskStatusCount = this.countTasksByStatus(this.tasks);

          const grouped = this.groupTasksByStatus(this.tasks);
          this.todoTasks = grouped.TO_DO;
          this.inProgressTasks = grouped.IN_PROGRESS;
          this.doneTasks = grouped.DONE;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  groupTasksByStatus(tasks: ITask[]) {
    return {
      TO_DO: tasks.filter((task) => task.status === 'TO_DO'),
      IN_PROGRESS: tasks.filter((task) => task.status === 'IN_PROGRESS'),
      DONE: tasks.filter((task) => task.status === 'DONE'),
    };
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  countTasksByStatus(tasks: ITask[]): Record<string, number> {
    return tasks.reduce((acc, task) => {
      const status = task.status ?? 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  openAddModal() {
    this.taskForm.reset();
    this.isEditMode = false;
    this.isModalVisible = true;
  }

  openEditModal(task: ITask) {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      startDate: task.startDate,
      status: task.status,
    });
    this.isEditMode = true;
    this.taskId = task.id;
    this.isModalVisible = true;
  }

  handleCancel() {
    this.isModalVisible = false;
    this.taskForm.reset();
  }

  onSubmitTask() {
    if (this.taskForm.valid) {
      this.isloading = true;
      const rawData = this.taskForm.value;
      const formattedDate = this.datePipe.transform(
        rawData.startDate,
        'yyyy-MM-dd'
      );

      const task = {
        ...rawData,
        start_date: formattedDate,
        folder_id: this.folderId,
      };

      if (this.isEditMode !== false && this.taskId !== 0) {
        this.taskService.EditTask(task, this.taskId).subscribe({
          next: (res) => {
            if (res.message?.toLowerCase() === 'success') {
              Swal.fire(
                this.translate.instant('MODAL.SAVE_SUCCESS'),
                '',
                'success'
              ).then((result) => {
                if (result.isConfirmed) {
                  this.getTasks();
                  this.handleCancel();
                  this.isloading = false;
                }
              });
            }
          },
          error: (err) => {
            Swal.fire(
              this.translate.instant('MODAL.SAVE_ERROR'),
              '',
              'error'
            ).then((result) => {
              if (result.isConfirmed) {
                this.handleCancel();
                this.isloading = false;
              }
            });
          },
        });
      } else {
        this.taskService.AddTask(task).subscribe({
          next: (res) => {
            if (res.message?.toLowerCase() === 'success') {
              Swal.fire(
                this.translate.instant('MODAL.SAVE_SUCCESS'),
                '',
                'success'
              ).then((result) => {
                if (result.isConfirmed) {
                  this.getTasks();
                  this.handleCancel();
                  this.isloading = false;
                }
              });
            }
          },
          error: (err) => {
            Swal.fire(
              this.translate.instant('MODAL.SAVE_ERROR'),
              '',
              'error'
            ).then((result) => {
              if (result.isConfirmed) {
                this.handleCancel();
                this.isloading = false;
              }
            });
          },
        });
      }
    }
  }

  onDeleteTask(id: number) {
    Swal.fire({
      title: this.translate.instant('DASHBOARD.DELETE_CONFIRM_TITLE'),
      text: this.translate.instant('DASHBOARD.DELETE_CONFIRM_TEXT'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant(
        'DASHBOARD.DELETE_CONFIRM_BUTTON'
      ),
      cancelButtonText: this.translate.instant(
        'DASHBOARD.DELETE_CANCEL_BUTTON'
      ),
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(id).subscribe({
          next: (res) => {
            if (res.message?.toLowerCase() === 'success') {
              Swal.fire(
                this.translate.instant('DASHBOARD.DELETE_SUCCESS_TITLE'),
                this.translate.instant('DASHBOARD.DELETE_SUCCESS_TEXT'),
                'success'
              ).then((result) => {
                if (result.isConfirmed) {
                  this.getTasks();
                  this.isloading = false;
                }
              });
            }
          },
          error: () => {
            Swal.fire(
              this.translate.instant('DASHBOARD.DELETE_FAIL_TITLE'),
              this.translate.instant('DASHBOARD.DELETE_FAIL_TEXT'),
              'error'
            ).then((result) => {
              if (result.isConfirmed) {
                this.isloading = false;
              }
            });
          },
        });
      }
    });
  }

  onDrop(event: CdkDragDrop<any[]>, newStatus: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];
      const taskId = movedTask.id;

      const payload = {
        description: movedTask.description,
        folder_id: movedTask.folder_id,
        start_date: movedTask.startDate,
        status: newStatus,
        title: movedTask.title,
      };

      // ลบออกจาก column เดิม
      event.previousContainer.data.splice(event.previousIndex, 1);

      // เพิ่มไปยัง column ใหม่
      event.container.data.splice(event.currentIndex, 0, movedTask);

      // เรียก API เพื่อบันทึกการเปลี่ยนแปลง
      this.taskService.EditTask(payload, taskId).subscribe({
        next: (res) => {
          if (res.message?.toLowerCase() === 'success') {
            this.notification.success(
              this.translate.instant('TASK.ALERT_MESSAGE_SUCCESS'),
              this.translate.instant('TASK.ALERT_DESCRIPTION_SUCCESS')
            );
          } else {
            this.notification.error(
              this.translate.instant('TASK.ALERT_MESSAGE_ERROR'),
              this.translate.instant('TASK.ALERT_DESCRIPTION_ERROR')
            );
          }
          this.getTasks();
        },
        error: (err) => {
          this.notification.error(
            this.translate.instant('TASK.ALERT_MESSAGE_ERROR'),
            err?.message ||
              this.translate.instant('TASK.ALERT_DESCRIPTION_ERROR')
          );
        },
      });
    }
  }

  onDragStarted(): void {
    document.body.classList.add('dragging-cursor');
  }

  onDragEnded(): void {
    document.body.classList.remove('dragging-cursor');
  }
}
