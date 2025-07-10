import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  constructor(private authService: AuthService){}

  ngOnInit() {
  this.authService.checkCurrentUser().subscribe({
    next: (res) => {
      if (res.message?.toLowerCase() === 'success') {
        this.authService.setCurrentUser(res.data);
      }
    },
    error: () => {
      this.authService.setCurrentUser(null!);
    }
  });
}
}
