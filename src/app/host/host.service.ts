import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Host} from './host';
import {Observable} from 'rxjs';

import {MessageService} from '../message/message.service';

@Injectable({
  providedIn: 'root'
})


export class HostService {

  public hosts: Host[] = [];

  constructor(private _http: HttpClient, private _msg: MessageService) {
    _msg.hostChanged.subscribe(
      (ha: Host[]) => {
        // this.probes.splice(0, this.probes.length);
        Array.prototype.forEach.call(ha, h => {
          const idx = this.hosts.findIndex(item => item.id === h.id);
          if (idx >= 0) {
            this.hosts[idx].id = h.id;
            this.hosts[idx].key = h.key;
            this.hosts[idx].name = h.name;
            this.hosts[idx].fqdn = h.fqdn;
            this.hosts[idx].ip = h.ip;
          } else {
            this.hosts.push(h);
          }
        });
        this.hosts.sort((l, r) => {
          if (l.name.toLocaleUpperCase() > r.name.toLocaleUpperCase()) {
            return 1;
          }
          if (l.name.toLocaleUpperCase() < r.name.toLocaleUpperCase()) {
            return -1;
          }
          return 0;
        });
      });

    _msg.hostDeleted.subscribe((h: Host) => {
      const idx = this.hosts.findIndex(item => item.id === h.id);
      if (idx >= 0) {
        this.hosts.splice(idx, 1);
      }
    });

    _msg.hostLocked.subscribe((h: Host) => {
      const idx = this.hosts.findIndex(item => item.id === h.id);
      if (idx >= 0) {
        this.hosts[idx].locked = h.locked;
      }
    });
  }

  private static replacer(key, value) {
    // Filtering out properties
    if (value === null) {
      return undefined;
    }
    return value;
  }

  getHost() {

    this._msg.send({data: '', action: 'GET', object: 'HOST', error_code: 0, });

  }

  getDNS(name: string): Observable<any> {

    const httpOption = {
      headers: new HttpHeaders({}),
      params: {'name': name, 'type': 'A'}
    };

    return this._http.get<any>('https://dns.google.com/resolve', httpOption).pipe();
  }

  saveHost(h: Host) {

    let action = 'UPDATE';
    if (h.id === undefined) {
      action = 'CREATE';
    }

    this._msg.send({action: action, object: 'HOST', error_code: 0, data: JSON.stringify(h), });
  }

  deleteHost(h: Host) {
    this._msg.send({action: 'DELETE', object: 'HOST', error_code: 0, data: JSON.stringify(h), });
  }
}
