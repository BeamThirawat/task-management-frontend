import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FolderService } from '../../core/services/folder.service';
import { IFolder } from '../../shared/models/folder.model';
import { CommonModule, NgFor } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import Swal from 'sweetalert2';
import { TaskService } from '../../core/services/task.service';
import { ITask, TaskStatus } from '../../shared/models/task.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    NzIconModule,
    TranslateModule,
    NgFor,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    CommonModule,
    NzButtonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
})
export class DashboardComponent implements OnInit {
  folders: IFolder[] = [];
  isAddModalVisible: boolean = false;
  projectForm!: FormGroup;
  folderId: number | null = null;
  isloading: boolean = false;
  isEditMode: boolean = false;
  tasksCounts: {
    [folderId: string]: { TO_DO: number; IN_PROGRESS: number; DONE: number } | undefined;
  } = {};

  constructor(
    private folderService: FolderService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required]],
      description: [''],
    });
    this.getFolders();
    this.getCountTasks();
  }

  getFolders() {
    this.folderService.getFolders().subscribe({
      next: (res) => {
        if (res.message?.toLowerCase() == 'success') {
          this.folders = res.data as IFolder[];
        }
      },
      error: (err) => {
        this.folders = [];
        console.error('Error loading folders:', err);
      },
    });
  }

  getCountTasks() {
    this.taskService.loadTasks();

    this.taskService.tasks$.subscribe((tasks) => {
      this.tasksCounts = this.countTasksByFolderAndStatus(tasks);
    });
  }

  openAddModal() {
    this.projectForm.reset();
    this.isEditMode = false;
    this.folderId = null;
    this.isAddModalVisible = true;
  }

  openEditModal(folder: IFolder) {
    this.projectForm.patchValue({
      projectName: folder.folder_name,
      description: folder.description,
    });
    this.isEditMode = true;
    this.folderId = folder.folder_id;
    this.isAddModalVisible = true;
  }

  handleCancel() {
    this.isAddModalVisible = false;
    this.projectForm.reset();
  }

  onSubmitProject() {
    if (this.projectForm.valid) {
      this.isloading = true;
      const { projectName, description } = this.projectForm.value;

      const payload = {
        folder_name: projectName,
        description: description,
      };

      if (this.isEditMode && this.folderId !== null) {
        this.folderService.EditFolder(payload, this.folderId).subscribe({
          next: (res) => {
            if (res.message?.toLowerCase() === 'success') {
              Swal.fire(
                this.translate.instant('MODAL.SAVE_SUCCESS'),
                '',
                'success'
              ).then((result) => {
                if (result.isConfirmed) {
                  this.getFolders();
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
        this.folderService.AddFolder(payload).subscribe({
          next: (res) => {
            if (res.message?.toLowerCase() === 'success') {
              Swal.fire(
                this.translate.instant('MODAL.SAVE_SUCCESS'),
                '',
                'success'
              ).then((result) => {
                if (result.isConfirmed) {
                  this.getFolders();
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

  onDeleteProject(id: number) {
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
        this.folderService.deleteFolder(id).subscribe({
          next: (res) => {
            if (res.message?.toLowerCase() === 'success') {
              Swal.fire(
                this.translate.instant('DASHBOARD.DELETE_SUCCESS_TITLE'),
                this.translate.instant('DASHBOARD.DELETE_SUCCESS_TEXT'),
                'success'
              ).then((result) => {
                if (result.isConfirmed) {
                  this.getFolders();
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

  private countTasksByFolderAndStatus(tasks: ITask[]) {
    const counts: {
      [folderId: string]: { TO_DO: number; IN_PROGRESS: number; DONE: number };
    } = {};

    for (const task of tasks) {
      const folderId = task.folder_id;

      if (!counts[folderId]) {
        counts[folderId] = { TO_DO: 0, IN_PROGRESS: 0, DONE: 0 };
      }

      if (Object.values(TaskStatus).includes(task.status as TaskStatus)) {
        counts[folderId][task.status as keyof typeof TaskStatus]++;
      }
    }

    return counts;
  }
}
