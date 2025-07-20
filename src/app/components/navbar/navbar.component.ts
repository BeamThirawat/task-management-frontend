import { Component, OnInit } from '@angular/core';
import { LanguageThemeToggleComponent } from '../../shared/language-theme-toggle/language-theme-toggle.component';
import { AuthService } from '../../core/services/auth.service';
import { ILogin } from '../../shared/models/user.model';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [LanguageThemeToggleComponent, NzButtonModule, NzIconModule, 
    TranslateModule, NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  user: ILogin | null = null;
  isLodding: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  onLogout() {
    Swal.fire({
      title: this.translate.instant("LOGOUT.TITLE"),
      text: this.translate.instant("LOGOUT.TEXT"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant("LOGOUT.CONFIRM"),
      cancelButtonText: this.translate.instant("LOGOUT.CANCLE"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: (res) => {
            if (res.message!.toLowerCase() === 'success') {
              this.router.navigate(['/login']);
            }
          },
          error: (err) => {
            Swal.fire(this.translate.instant("LOGOUT.TITLE_ERROR"), this.translate.instant("LOGOUT.TEXT_ERROR"), 'error');
          },
        });
      }
    });
  }
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
