import { Component } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    NzInputModule,
    NzButtonModule,
    NzDividerModule,
    NzIconModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule,
    NzFormModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  passwordVisible = false;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    console.log(this.loginForm.value);
  }
}
