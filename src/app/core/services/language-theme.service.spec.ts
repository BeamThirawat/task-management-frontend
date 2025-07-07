import { TestBed } from '@angular/core/testing';

import { LanguageThemeService } from './language-theme.service';

describe('LanguageThemeService', () => {
  let service: LanguageThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
