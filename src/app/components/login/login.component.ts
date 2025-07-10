import { Component } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NgIf } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { ILogin, IUser, Login } from '../../shared/models/user.model';

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
    NzSpinModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  passwordVisible = false;
  loginForm: FormGroup;
  isLodding: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onLoginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.processLogin(this.loginForm.getRawValue());
  }

  processLogin(fLoginValue: Login) {
    this.isLodding = true;
    let fLogin: Login = new Login();

    fLogin.email = fLoginValue['email'];
    fLogin.password = fLoginValue['password'];

    this.authService.login(fLogin).subscribe({
      next: (res) => {
        if (res.message!.toLowerCase() === 'success') {
          this.isLodding = false;
          this.authService.setCurrentUser(res.data as ILogin);
          this.processSuccess();
        } else {
          this.isLodding = false;
          this.processError(this.translate.instant(res.message!));
        }
      },
      error: (err) => {
        this.isLodding = false;
        console.log(err);
        this.processError(this.translate.instant('LOGIN.LOGIN_FAIL'));
      },
    });
  }

  processSuccess() {
    this.router.navigate(['/dashboard']);
  }

  processError(message: string) {
    Swal.fire(this.translate.instant('ERROR'), message, 'error');
  }
}
