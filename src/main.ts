import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ICONS } from './app/shared/icons/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { routes } from './app/app.routes'
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localeTh, 'th');
registerLocaleData(localeEn, 'en');

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    BrowserAnimationsModule,
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpTranslateLoader,
          deps: [HttpClient]
        }
      }),
      NzIconModule.forRoot(ICONS)
    )
  ]
});
