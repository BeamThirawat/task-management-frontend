import { NgStyle } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageThemeService } from '../../core/services/language-theme.service';
import { Subscription } from 'rxjs';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { NZ_I18N, th_TH, en_US } from 'ng-zorro-antd/i18n';

@Component({
  selector: 'app-language-theme-toggle',
  imports: [TranslateModule, NgStyle],
  templateUrl: './language-theme-toggle.component.html',
  styleUrl: './language-theme-toggle.component.css',
})
export class LanguageThemeToggleComponent implements OnInit, OnDestroy {
  isLangThai: boolean = false;
  isDarkMode: boolean = false;

  private sub = new Subscription();

  constructor(
    private translate: TranslateService,
    private langThemeService: LanguageThemeService,
    private i18n: NzI18nService
  ) {}

  ngOnInit(): void {
    // Subscribe language and set isLangThai
    this.sub.add(
      this.langThemeService.lang$.subscribe((lang) => {
        this.isLangThai = lang === 'th';
        this.translate.use(lang);
        this.i18n.setLocale(lang === 'th' ? th_TH : en_US);
      })
    );
    // Subscribe language and set isDarkMode
    this.sub.add(
      this.langThemeService.theme$.subscribe((theme) => {
        this.isDarkMode = theme === 'dark';
      })
    );

    this.langThemeService.setTheme(this.langThemeService.currentTheme);
  }

  switchLanguage($event: Event) {
    const input = $event.target as HTMLInputElement;
    const lang = input.checked ? 'th' : 'en';
    this.langThemeService.setLang(lang);
    this.i18n.setLocale(lang === 'th' ? th_TH : en_US);
  }

  toggleTheme(event: Event): void {
    const input = event.target as HTMLInputElement;
    const theme = input.checked ? 'dark' : 'light';
    this.langThemeService.setTheme(theme);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
