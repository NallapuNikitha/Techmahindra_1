import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Sign Up'
  },
  {
    path: 'tasks',
    component: TaskListComponent,
    title: 'Tasks',
    canActivate: [() => {
      const authService = inject(AuthService);
      return authService.isLoggedIn;
    }]
  }
];
