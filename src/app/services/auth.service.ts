import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isBrowser: boolean;
  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(@Inject(PLATFORM_ID) platformId: Object, private router: Router) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadUser();
  }

  private loadUser(): void {
    if (this.isBrowser) {
      const user = localStorage.getItem('currentUser');
      if (user) {
        this.currentUserSubject.next(JSON.parse(user));
        this.isLoggedIn$.next(true);
      }
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.isLoggedIn$.value;
  }

  login(email: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.currentUserSubject.next(user);
      this.isLoggedIn$.next(true);
      if (this.isBrowser) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      return true;
    }
    return false;
  }

  signup(name: string, email: string, password: string): boolean {
    try {
      console.log('Starting signup process...');
      
      // Input validation
      if (!name || !email || !password) {
        console.error('Missing required fields');
        return false;
      }

      const users = this.getUsers();
      
      // Check if email already exists
      if (users.some(user => user.email === email)) {
        console.error('Email already exists');
        return false;
      }

      // Create new user
      const newUser: User = {
        id: users.length + 1,
        name,
        email,
        password
      };

      // Add to users array
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Users saved to localStorage:', users);

      // Set as current user
      this.currentUserSubject.next(newUser);
      this.isLoggedIn$.next(true);
      if (this.isBrowser) {
        localStorage.setItem('currentUser', JSON.stringify(newUser));
      }
      console.log('Current user set:', newUser);

      return true;
    } catch (error) {
      console.error('Error during signup:', error);
      return false;
    }
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.isLoggedIn$.next(false);
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.router.navigate(['/login']);
  }

  private getUsers(): User[] {
    if (this.isBrowser) {
      try {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
      } catch (error) {
        console.error('Error getting users:', error);
        return [];
      }
    }
    return [];
  }
} 