import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageThemeToggleComponent } from './language-theme-toggle.component';

describe('LanguageThemeToggleComponent', () => {
  let component: LanguageThemeToggleComponent;
  let fixture: ComponentFixture<LanguageThemeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageThemeToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
