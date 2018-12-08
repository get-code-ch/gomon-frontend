import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {User, JwtToken} from './auth';
import {MessageService} from './message.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  authenticated = false;

  constructor(private messageService: MessageService) {
  }

  loginUser(u: User): Observable<JwtToken> {

    const tk: JwtToken = {token: ''};

    if (u.username !== '') {
      tk.token = u.username + ':' + u.password;
      localStorage.setItem('token', tk.token);
      this.authenticated = true;
      this.messageService.add('Logged in');
    } else {
      tk.token = '';
      this.authenticated = false;
      localStorage.removeItem('token');
      this.messageService.add('Invalid username/password');
    }
    return of(tk);
  }

  getToken(): Observable<JwtToken> {

    const tk: JwtToken = {token: ''};

    tk.token = localStorage.getItem('token');
    if (tk.token !== '' && tk.token !== null) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }
    return of(tk);
  }
}
