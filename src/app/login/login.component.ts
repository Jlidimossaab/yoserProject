import { Component, EventEmitter, Output } from '@angular/core';
import { Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/models/User';
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
    @Output() display = new EventEmitter();
    constructor(private authService: AuthService, private loginService: LoginService, private router: Router, private messageService: MessageService) { }

    login(): void {
        this.authService.login(this.username, this.password).subscribe(
            (user) => {
                if (user) {
                    this.loginService.setCurrentUser(user);
                    this.loginService.setLoggedIn(true);
                    this.display.next(false);
                    this.router.navigate([`/consulter_categorie`]);
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You\'re current credentials are wrong' });
                }
            },
            (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You\'re current credentials are wrong' });
                console.error('Login failed', error);
            }
        );
    }
}
