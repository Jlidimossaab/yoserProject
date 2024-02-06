import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/models/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null> = this.currentUserSubject.asObservable();

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  constructor() {
    // Initialize currentUser from localStorage on service instantiation
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  public setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  public clearCurrentUser(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  setLoggedIn(value: boolean) {
    // You can implement this if needed, but it's not directly related to currentUser
  }

  getLoggedIn(): Observable<boolean> {
    // You can implement this if needed, but it's not directly related to currentUser
    return new Observable<boolean>(); // Dummy implementation
  }
}
