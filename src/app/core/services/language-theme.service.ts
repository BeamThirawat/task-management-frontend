import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageThemeService {
  private _lang = new BehaviorSubject<string>(localStorage.getItem('lang') || 'en');
  private _theme = new BehaviorSubject<string>(localStorage.getItem('theme') || 'light');

  lang$ = this._lang.asObservable();
  theme$ = this._theme.asObservable();

  get currentTheme() {
    return this._theme.value;
  }
  
  setLang(lang: string) {
    localStorage.setItem('lang', lang);
    this._lang.next(lang);
  }

  setTheme(theme: string) {
    localStorage.setItem('theme', theme);
    this._theme.next(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
