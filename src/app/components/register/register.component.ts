import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Register } from '../../shared/models/user.model';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-register',
  imports: [
    NzInputModule,
    NzButtonModule,
    NzDividerModule,
    NzIconModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule,
    NgIf,
    NzFormModule,
    NzSpinModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  data!: Register;
  islodding: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;

    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.processRegister(this.registerForm.getRawValue());
  }

  onLoginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  processRegister(fRegisterValue: Register) {
    this.islodding = true;
    let fRegister: Register = new Register();

    fRegister.email = fRegisterValue['email'];
    fRegister.username = fRegisterValue['username'];
    fRegister.password = fRegisterValue['password'];

    this.authService.register(fRegister).subscribe({
      next: (res) => {
        if (res.message!.toLowerCase() === 'success') {
          this.islodding = false;
          this.processSuccess(this.translate.instant('REGISTER.CREATE_SUCCESS'));
        } else {
          this.islodding = false;
          this.processError(this.translate.instant(res.message!));
        }
      },
      error: (err) => {
        this.islodding = false;
        console.log(err);
        this.processError(this.translate.instant('REGISTER.CREATE_FAIL'));
      },
    });
  }

  processSuccess(message: string) {
    Swal.fire(this.translate.instant("SUCCESS"), message, "success").then(
      (result) => {
        this.close();
      }
    );
  }

  processError(message: string) {
    Swal.fire(this.translate.instant("ERROR"), message, "error");
  }

  close() {
    this.router.navigate(["/login"]);
  }
}
