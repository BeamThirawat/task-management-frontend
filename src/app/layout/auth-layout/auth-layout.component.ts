import { Component } from '@angular/core';
import { LanguageThemeToggleComponent } from '../../shared/language-theme-toggle/language-theme-toggle.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [LanguageThemeToggleComponent, RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {}
