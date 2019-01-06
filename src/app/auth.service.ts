import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {User, JwtToken} from './auth';
import {MessageService} from './message.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class AuthService {


  authenticated = false;
  private _authUrl = '/api/authenticate';
  private _tk: JwtToken = {token: '', msg: ''};

  constructor(private _messageService: MessageService, private _http: HttpClient) {
  }

  loginUser(u: User): Observable<boolean> {
    let s: string;
    if (u.username !== '') {
      if (environment.apiUrl !== undefined) {
        s = environment.apiUrl + this._authUrl;
      } else {
        s = window.location.origin + this._authUrl;
      }

      this._http.post<JwtToken>(s, u)
        .subscribe(data => {
          this._tk = data;
          if (data.msg !== undefined) {
            this._tk.msg = data.msg;
            this._messageService.add(data.msg);
          }
          if (data.token !== undefined && data.token !== '') {
            this._tk.token = data.token;
            localStorage.setItem('token', this._tk.token);
            this.authenticated = true;
            this._messageService.add('Logged in');
          } else {
            this._tk.token = '';
            localStorage.removeItem('token');
            this.authenticated = false;
          }
        });
    } else {
      this._tk.token = '';
      this.authenticated = false;
      localStorage.removeItem('token');
      this._messageService.add('Invalid username/password');
    }
    return of(this.authenticated);
  }

  logoutUser() {
    this.authenticated = false;
    localStorage.removeItem('token');
  }

  getToken(): JwtToken {
    const tk: JwtToken = {token: '', msg: ''};

    tk.token = localStorage.getItem('token');
    if (tk.token !== '' && tk.token !== null) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }
    return tk;
  }
}
