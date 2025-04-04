import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color:rgba(250, 250, 250, 0.35);">
      <div style="border: 1px solid #dbdbdb; padding: 40px; border-radius: 4px; width: 350px; background-color: white;">
        <h2 style="text-align: center; margin-bottom: 20px; font-size: 1.8em;">Task Manager Login</h2>
        <input type="text" placeholder="Username" #username style="width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #dbdbdb; border-radius: 3px; box-sizing: border-box; font-size: 1em;" />
        <input type="password" placeholder="Password" #password style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #dbdbdb; border-radius: 3px; box-sizing: border-box; font-size: 1em;" />
        <button (click)="login(username.value, password.value)" style="width: 100%; padding: 12px; background-color: #0095f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1em;">Login</button>
      </div>
    </div>
  `,
  styles: [`
    input {
      font-size: 1.5em;
    }
    button{
      font-size: 1.5em;
    }
  `]
})
export class LoginComponent {
  constructor(private router: Router) {}

  login(username: string, password: string) {
    if (username === 'user' && password === 'pass') {
      localStorage.setItem('loggedIn', 'true');
      this.router.navigate(['/home']);
    } else {
      alert('Invalid credentials');
    }
  }
}