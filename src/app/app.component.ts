import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AuthService } from './services/auth.service';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    TaskListComponent,
    SignupComponent,
    LoginComponent
  ],
  template: `
    <div class="app-container">
      <header>
        <h1>Task Manager</h1>
        <nav *ngIf="isLoggedIn">
          <a routerLink="/tasks">Tasks</a>
          <button (click)="logout()">Logout</button>
        </nav>
        <nav *ngIf="!isLoggedIn">
          <a routerLink="/login">Login</a>
          <a routerLink="/signup">Sign Up</a>
        </nav>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    header {
      background-color: #343a40;
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    nav {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    a:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    button {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button:hover {
      background-color: #c82333;
    }

    main {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
