import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {User, JwtToken} from './auth';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {


  public authenticated = false;
  public authChange: Subject<boolean> = new Subject<boolean>();
  private _authUrl = '/api/authenticate';
  private _tk: JwtToken = {token: '', msg: ''};

  constructor(private _http: HttpClient) {
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
          }
          if (data.token !== undefined && data.token !== '') {
            this._tk.token = data.token;
            localStorage.setItem('token', this._tk.token);
            this.authenticated = true;
          } else {
            this._tk.token = '';
            localStorage.removeItem('token');
            this.authenticated = false;
          }
          this.authChange.next(this.authenticated);
        });
    } else {
      this._tk.token = '';
      this.authenticated = false;
      localStorage.removeItem('token');
      this.authChange.next(this.authenticated);
    }
    return of(this.authenticated);
  }

  logoutUser() {
    this.authenticated = false;
    localStorage.removeItem('token');
    this.authChange.next(this.authenticated);
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getToken(): JwtToken {
    const tk: JwtToken = {token: '', msg: ''};

    tk.token = localStorage.getItem('token');
    if (tk.token !== '' && tk.token !== null) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }
    this.authChange.next(this.authenticated);
    return tk;
  }

}
