import { Component } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { LanguageThemeToggleComponent } from '../../shared/language-theme-toggle/language-theme-toggle.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    NzInputModule,
    NzButtonModule,
    NzDividerModule,
    NzIconModule,
    LanguageThemeToggleComponent,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  passwordVisible = false;
}
