import { Component } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService,private loginService: LoginService) {}

  login(): void {
      this.authService.login(this.username, this.password).subscribe(
          (user) => {
              if (user) {
                  // Authentication successful
                  console.log('Login successful:', user);
                  this.loginService.setLoggedIn(true);
                  // Redirect or perform other actions after successful login
              } else {
                  // Authentication failed
                  console.error('Invalid credentials');
              }
          },
          (error) => {
              console.error('Login failed', error);
          }
      );
  }
}
