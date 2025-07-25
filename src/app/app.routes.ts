import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { TaskComponent } from './components/task/task.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
      { path: 'task/:id', component: TaskComponent, canActivate: [authGuard] },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
