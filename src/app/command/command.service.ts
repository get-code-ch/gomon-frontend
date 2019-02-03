import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Command} from './command';

import {MessageService} from '../message/message.service';

@Injectable({
  providedIn: 'root'
})

export class CommandService {

  public commands: Command[] = [];

  constructor(private _http: HttpClient, private _msg: MessageService) {
    _msg.commandChanged.subscribe(
      (ca: Command[]) => {
        // this.probes.splice(0, this.probes.length);
        Array.prototype.forEach.call(ca, c => {
          const idx = this.commands.findIndex(item => item.id === c.id);
          if (idx >= 0) {
            this.commands[idx].id = c.id;
            this.commands[idx].key = c.key;
            this.commands[idx].name = c.name;
            this.commands[idx].description = c.description;
            this.commands[idx].command = c.command;
            this.commands[idx].command_type = c.command_type;
          } else {
            this.commands.push(c);
          }
        });
        this.commands.sort((l, r) => {
          if (l.name.toLocaleUpperCase() > r.name.toLocaleUpperCase()) {
            return 1;
          }
          if (l.name.toLocaleUpperCase() < r.name.toLocaleUpperCase()) {
            return -1;
          }
          return 0;
        });
      });

    _msg.commandDeleted.subscribe((c: Command) => {
      const idx = this.commands.findIndex(item => item.id === c.id);
      if (idx >= 0) {
        this.commands.splice(idx, 1);
      }
    });

    _msg.commandLocked.subscribe((c: Command) => {
      const idx = this.commands.findIndex(item => item.id === c.id);
      if (idx >= 0) {
        this.commands[idx].locked = c.locked;
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

  getCommand() {

    this._msg.send({data: '', action: 'GET', object: 'COMMAND', error_code: 0,});

  }

  saveCommand(c: Command) {
    let action = 'UPDATE';
    if (c.id === undefined) {
      action = 'CREATE';
    }

    this._msg.send({action: action, object: 'COMMAND', error_code: 0, data: JSON.stringify(c),});
  }

  deleteCommand(c: Command) {
    this._msg.send({action: 'DELETE', object: 'COMMAND', error_code: 0, data: JSON.stringify(c),});
  }
}
