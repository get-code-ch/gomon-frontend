import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {JwtToken} from './auth';
import {Probe} from './probe';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProbeService {
  private _probeUrl = '/api/probe';
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

  getProbe(): Observable<Probe[]> {

    this._tk = this._auth.getToken();
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Token': this._tk.token
      }),
      params: {}
    };

    if (environment.apiUrl !== undefined) {
      return this._http.get<Probe[]>(environment.apiUrl + this._probeUrl, httpOption).pipe();
    } else {
      return this._http.get<Probe[]>( window.location.origin + this._probeUrl,  httpOption).pipe();
    }
  }

  saveProbe(p: Probe): Observable<Probe> {
    this._tk = this._auth.getToken();
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Token': this._tk.token
      })
    };

    // Convert date String to ISOString Date format
    p.next = new Date(p.next).toISOString();
    p.last = new Date(p.last).toISOString();

    if (p.id !== undefined) {
      if (environment.apiUrl !== undefined) {
        return this._http.put<Probe>(environment.apiUrl + this._probeUrl, p, httpOption).pipe();
      } else {
        return this._http.put<Probe>(window.location.origin + this._probeUrl, p, httpOption).pipe();
      }
    } else {
      if (environment.apiUrl !== undefined) {
        return this._http.post<Probe>(environment.apiUrl + this._probeUrl, p, httpOption).pipe();
      } else {
        return this._http.post<Probe>(window.location.origin + this._probeUrl, p, httpOption).pipe();
      }
    }
  }

  deleteProbe(p: Probe): Observable<Probe> {
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
        return this._http.delete<Probe>(environment.apiUrl + this._probeUrl, httpOption).pipe();
      } else {
        return this._http.delete<Probe>(window.location.origin + this._probeUrl, httpOption).pipe();
      }
    } else {
      return;
    }
  }
}
