import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env';
import { User } from 'src/models/User';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<User> {
        return this.http.post<User>(environment.url + "/user/login", { username, password });
    }
}
