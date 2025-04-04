import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Sign Up</h2>
        <form (ngSubmit)="onSubmit()" #signupForm="ngForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              [(ngModel)]="name" 
              required
              minlength="2"
              #nameInput="ngModel"
            >
            <div class="error" *ngIf="nameInput.invalid && nameInput.touched">
              <span *ngIf="nameInput.errors?.['required']">Name is required</span>
              <span *ngIf="nameInput.errors?.['minlength']">Name must be at least 2 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="email" 
              required 
              email
              #emailInput="ngModel"
            >
            <div class="error" *ngIf="emailInput.invalid && emailInput.touched">
              <span *ngIf="emailInput.errors?.['required']">Email is required</span>
              <span *ngIf="emailInput.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="password" 
              required
              minlength="6"
              #passwordInput="ngModel"
            >
            <div class="error" *ngIf="passwordInput.invalid && passwordInput.touched">
              <span *ngIf="passwordInput.errors?.['required']">Password is required</span>
              <span *ngIf="passwordInput.errors?.['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              [(ngModel)]="confirmPassword" 
              required
              #confirmPasswordInput="ngModel"
            >
            <div class="error" *ngIf="confirmPasswordInput.touched && password !== confirmPassword">
              Passwords do not match
            </div>
          </div>

          <div class="error" *ngIf="error">
            {{ error }}
          </div>

          <button type="submit" [disabled]="signupForm.invalid || password !== confirmPassword">Sign Up</button>
        </form>

        <div class="auth-links">
          <p>Already have an account? <a routerLink="/login">Login</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .auth-links {
      margin-top: 1.5rem;
      text-align: center;
    }

    .auth-links a {
      color: #007bff;
      text-decoration: none;
    }

    .auth-links a:hover {
      text-decoration: underline;
    }
  `]
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    console.log('Attempting signup with:', { name: this.name, email: this.email });
    
    // Validate passwords match
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    // Validate all fields are filled
    if (!this.name || !this.email || !this.password) {
      this.error = 'All fields are required';
      return;
    }

    try {
      const success = this.authService.signup(this.name, this.email, this.password);
      if (success) {
        console.log('Signup successful, navigating to tasks');
        this.router.navigate(['/tasks']);
      } else {
        this.error = 'Email already exists';
      }
    } catch (error) {
      console.error('Signup error:', error);
      this.error = 'An error occurred during signup. Please try again.';
    }
  }
} 