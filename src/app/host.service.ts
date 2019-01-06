import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {JwtToken} from './auth';
import {Host} from './host';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})


export class HostService {

  private _hostUrl = '/api/host';
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

  getHosts(): Observable<Host[]> {

    this._tk = this._auth.getToken();
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Token': this._tk.token
      }),
      params: {}
    };

    if (environment.apiUrl !== undefined) {
      return this._http.get<Host[]>(environment.apiUrl + this._hostUrl, httpOption).pipe();
    } else {
      return this._http.get<Host[]>( window.location.origin + this._hostUrl,  httpOption).pipe();
    }
  }

  getDNS(name: string): Observable<any> {

    const httpOption = {
      headers: new HttpHeaders({}),
      params: {'name': name, 'type': 'A'}
    };

    return this._http.get<any>('https://dns.google.com/resolve', httpOption).pipe();
  }

  saveHost(h: Host): Observable<Host> {
    this._tk = this._auth.getToken();
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Token': this._tk.token
      })
    };
    if (h.id !== undefined) {
      // return this._http.put<Host>(window.location.host + this._hostUrl, h, httpOption).pipe();
      if (environment.apiUrl !== undefined) {
        return this._http.put<Host>(environment.apiUrl + this._hostUrl, h, httpOption).pipe();
      } else {
        return this._http.put<Host>(window.location.origin + this._hostUrl, h, httpOption).pipe();
      }
    } else {
      if (environment.apiUrl !== undefined) {
        return this._http.post<Host>(environment.apiUrl + this._hostUrl, h, httpOption).pipe();
      } else {
        return this._http.post<Host>(window.location.origin + this._hostUrl, h, httpOption).pipe();
      }
    }
  }

  deleteHost(h: Host): Observable<Host> {
    this._tk = this._auth.getToken();
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Token': this._tk.token
      }),
      params: {'id': h.id}
    };
    if (h.id !== undefined) {
      if (environment.apiUrl !== undefined) {
        return this._http.delete<Host>(environment.apiUrl + this._hostUrl, httpOption).pipe();
      } else {
        return this._http.delete<Host>(window.location.origin + this._hostUrl, httpOption).pipe();
      }
    } else {
      return;
    }
  }
}
