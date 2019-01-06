import {Injectable} from '@angular/core';
import {JwtToken} from './auth';
import {webSocket} from 'rxjs/webSocket';
import {environment} from '../environments/environment';

interface SocketMessage {
  action?: string;
  object?: string;
  data: string;
  error_code: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  public messages: string[] = [];
  private _socket;
  public token: JwtToken = {token: '', msg: ''};

  constructor() {
  }

  add(message: string) {
    if (this.messages.length > 10) {
      this.messages.shift();
    }
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
    this.add('log cleared');
  }

  connect() {
    if (this._socket !== undefined) {
      this._socket.complete();
    }

    if (environment.socketUrl !== undefined) {
      this._socket = webSocket(environment.socketUrl);
    } else {
      this._socket = webSocket('ws://' + window.location.host + '/socket');
    }

    this._socket.subscribe(
      (msg: SocketMessage) => {
        console.log('message received: ' + msg.data + ' error: ' + msg.error);
        this.add(msg.data);
        // TODO: Handle messages
      },
      (err) => console.log(err),
      () => console.log('complete')
    );

    this._socket.onclose = function () {
      console.log('Disconnected');
      this._socket = undefined;
    };
  }

  send(msg: SocketMessage) {
    this._socket.next(msg);
  }

}
