import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {JwtToken} from './auth';
import {Command} from './command';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CommandService {
  private _commandUrl = '/api/command';
  private _tk: JwtToken = {token: '', msg: ''};

  constructor(private _http: HttpClient, private _auth: AuthService) {
  }

  private static replacer(key, value) {
    // Filtering out properties
    if (value === null) {
      return undefined;
    }
    return value;
  }

  getCommand(): Observable<Command[]> {

    this._tk = this._auth.getToken();
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Token': this._tk.token
      }),
      params: {}
    };

    if (environment.apiUrl !== undefined) {
      return this._http.get<Command[]>(environment.apiUrl + this._commandUrl, httpOption).pipe();
    } else {
      return this._http.get<Command[]>( window.location.origin + this._commandUrl,  httpOption).pipe();
    }
  }

  saveCommand(p: Command): Observable<Command> {
    this._tk = this._auth.getToken();
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Token': this._tk.token
      })
    };
    if (p.id !== undefined) {
      if (environment.apiUrl !== undefined) {
        return this._http.put<Command>(environment.apiUrl + this._commandUrl, p, httpOption).pipe();
      } else {
        return this._http.put<Command>(window.location.origin + this._commandUrl, p, httpOption).pipe();
      }
    } else {
      if (environment.apiUrl !== undefined) {
        return this._http.post<Command>(environment.apiUrl + this._commandUrl, p, httpOption).pipe();
      } else {
        return this._http.post<Command>(window.location.origin + this._commandUrl, p, httpOption).pipe();
      }
    }
  }

  deleteCommand(p: Command): Observable<Command> {
    this._tk = this._auth.getToken();
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Token': this._tk.token
      }),
      params: {'id': p.id}
    };
    if (p.id !== undefined) {
      if (environment.apiUrl !== undefined) {
        return this._http.delete<Command>(environment.apiUrl + this._commandUrl, httpOption).pipe();
      } else {
        return this._http.delete<Command>(window.location.origin + this._commandUrl, httpOption).pipe();
      }
    } else {
      return;
    }
  }
}
