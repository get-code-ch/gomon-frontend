import {Injectable} from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {Probe} from './probe';
import {MessageService} from '../message/message.service';

@Injectable({
  providedIn: 'root'
})


export class ProbeService {

  public probes: Probe[] = [];

  constructor(private _http: HttpClient, private _msg: MessageService) {
    _msg.probeChanged.subscribe(
      (pa: Probe[]) => {
        // this.probes.splice(0, this.probes.length);
        Array.prototype.forEach.call(pa, p => {
          const idx = this.probes.findIndex(item => item.id === p.id);
          if (idx >= 0) {
            if (!this.probes[idx].locked) {
              this.probes[idx].id = p.id;
              this.probes[idx].host_id = p.host_id;
              this.probes[idx].command_id = p.command_id;
              this.probes[idx].name = p.name;
              this.probes[idx].description = p.description;
              this.probes[idx].interval = p.interval;
              this.probes[idx].username = p.username;
              this.probes[idx].password = p.password;
            }
            this.probes[idx].next = p.next;
            this.probes[idx].last = p.last;
            this.probes[idx].result = p.result;
            this.probes[idx].state = p.state;
          } else {
            this.probes.push(p);
          }
        });
        this.probes.sort((l, r) => {
          if (l.name.toLocaleUpperCase() > r.name.toLocaleUpperCase()) {
            return 1;
          }
          if (l.name.toLocaleUpperCase() < r.name.toLocaleUpperCase()) {
            return -1;
          }
          return 0;
        });
      });

    _msg.probeDeleted.subscribe((p: Probe) => {
      const idx = this.probes.findIndex(item => item.id === p.id);
      if (idx >= 0) {
        this.probes.splice(idx, 1);
      }
    });

    _msg.probeLocked.subscribe((p: Probe) => {
      const idx = this.probes.findIndex(item => item.id === p.id);
      if (idx >= 0) {
        this.probes[idx].locked = p.locked;
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

  getProbe() {

    this._msg.send({data: '', action: 'GET', object: 'PROBE', error_code: 0, });

  }

  saveProbe(p: Probe) {
    // Convert date String to ISOString Date format
    p.next = new Date(p.next).toISOString();
    p.last = new Date(p.last).toISOString();

    let action = 'UPDATE';
    if (p.id === undefined) {
      action = 'CREATE';
    }

    this._msg.send({action: action, object: 'PROBE', error_code: 0, data: JSON.stringify(p), });
  }

  deleteProbe(p: Probe) {
    this._msg.send({action: 'DELETE', object: 'PROBE', error_code: 0, data: JSON.stringify(p), });
  }
}
