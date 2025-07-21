import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TaskService } from '../../core/services/task.service';
import { ITask } from '../../shared/models/task.model';
import { DatePipe, NgFor } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
    ReactiveFormsModule
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnInit {
  folderId: number = 0;
  folderName: string = '';
  tasks: ITask[] = [];
  taskStatusCount: Record<string, number> = {};
  isModalVisible: boolean = false;
  taskForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.folderId = Number(this.route.snapshot.paramMap.get('id'));
    this.folderName = this.route.snapshot.paramMap.get('projectName') ?? '';
    this.taskForm = this.fb.group({ 
      title: ['', [Validators.required]],
      description: [''],
      startDate: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });

    this.getTasks();
  }

  getTasks() {
    this.taskService.loadTaskByFolder(this.folderId).subscribe({
      next: (res) => {
        if (res.message?.toLowerCase() === 'success') {
          this.tasks = res.data as ITask[];
          console.log(this.tasks);
          this.taskStatusCount = this.countTasksByStatus(this.tasks);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
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

  handleCancel() {

  }
}
