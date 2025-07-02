import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-theme-toggle',
  imports: [TranslateModule, NgStyle],
  templateUrl: './language-theme-toggle.component.html',
  styleUrl: './language-theme-toggle.component.css',
})
export class LanguageThemeToggleComponent {
  isLangThai: boolean = false;
  isDarkMode: boolean = false;

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.translate.use(savedLang);

    const saveTheme = localStorage.getItem('theme') || 'light';

    this.isLangThai = savedLang === 'th';
    this.isDarkMode = saveTheme === 'dark';

    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  switchLanguage($event: Event) {
    const input = $event.target as HTMLInputElement;
    const isChecked = input.checked;
    const lang = isChecked ? 'th' : 'en';
    localStorage.setItem('lang', lang);

    this.isLangThai = lang === 'th';
    this.translate.use(lang);
  }

  toggleTheme(event: Event): void {
    const input = event.target as HTMLInputElement;
    const theme = input.checked ? 'dark' : 'light';

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
    this.isDarkMode = theme === 'dark';
  }
  
}
