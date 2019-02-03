import {Injectable} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';
import {Probe} from '../probe/probe';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {Host} from '../host/host';
import {Command} from '../command/command';
import {LoggingService} from '../logging/logging.service';

interface SocketMessage {
  action?: string;
  object?: string;
  data: string;
  error_code: number;
  error?: string;
  client_id?: number;
  username?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  private _socket = undefined;
  private _tk;

  // For Probe messages/change notification
  public probeChanged: Subject<Probe[]> = new Subject<Probe[]>();
  public probeDeleted: Subject<Probe> = new Subject<Probe>();
  public probeLocked: Subject<Probe> = new Subject<Probe>();

  // For Host messages/change notification
  public hostChanged: Subject<Host[]> = new Subject<Host[]>();
  public hostDeleted: Subject<Host> = new Subject<Host>();
  public hostLocked: Subject<Host> = new Subject<Host>();

  // For Command messages/change notification
  public commandChanged: Subject<Command[]> = new Subject<Command[]>();
  public commandDeleted: Subject<Command> = new Subject<Command>();
  public commandLocked: Subject<Command> = new Subject<Command>();

  public online = false;
  public clientId = 0;

  constructor(private _auth: AuthService, private _router: Router, private _logs: LoggingService) {
    // Check if authentication changed open socket or close it.
    _auth.authChange.subscribe((isAuth) => {
      if (isAuth && this._socket === undefined) {
        this.connect();
      }
      if (!isAuth && this._socket !== undefined) {
        this.close();
        this._router.navigate(['/']);
      }
    });
  }

  connect() {
    // Create websocket
    if (environment.socketUrl !== undefined) {
      this._socket = webSocket(environment.socketUrl);
    } else {
      this._socket = webSocket('ws://' + window.location.host + '/socket');
    }

    // Listen message on websocket
    this._socket.subscribe(
      (msg: SocketMessage) => {

        let action = 'LOG';
        let object = '';
        this.online = true;

        if (msg.action !== undefined) {
          action = msg.action.toUpperCase();
        }

        if (msg.object !== undefined) {
          object = msg.object.toUpperCase();
        }

        if (action === 'LOG') {
          console.log('message received: ' + msg.data + ' error: ' + msg.error_code + ' ' + msg.error);
        }

        // TODO: Handle messages

        // Handle authentication request
        if (action === 'AUTHENTICATE') {
          this._tk = this._auth.getToken();
          this.clientId = msg.client_id;
          this.send({action: 'AUTHENTICATE', token: this._tk.token, client_id: msg.client_id, data: '', error_code: 0,});
        }

        // Logging messages
        if (action === 'LOG') {
          this._logs.add(msg.data);
        }

        // Handling Probe object
        if (action === 'DELETE' && object === 'PROBE') {
          const p = JSON.parse(msg.data);
          this.probeDeleted.next(p);
        }

        if ((action === 'LOCK' || action === 'UNLOCK') && object === 'PROBE') {
          const p = JSON.parse(msg.data);
          this.probeLocked.next(p);
        }

        if ((action === 'UPDATE' || action === 'CREATE' || action === 'GET') && object === 'PROBE') {
          const p = JSON.parse(msg.data);
          let pa: Probe[] = [];
          if (Array.isArray(p)) {
            pa = p;
          } else {
            pa.push(p);
          }
          this.probeChanged.next(pa);
        }

        // Handling command object
        if (action === 'DELETE' && object === 'COMMAND') {
          const c = JSON.parse(msg.data);
          this.commandDeleted.next(c);
        }

        if ((action === 'LOCK' || action === 'UNLOCK') && object === 'COMMAND') {
          const c = JSON.parse(msg.data);
          this.commandLocked.next(c);
        }

        if ((action === 'UPDATE' || action === 'CREATE' || action === 'GET') && object === 'COMMAND') {
          const c = JSON.parse(msg.data);
          let ca: Command[] = [];
          if (Array.isArray(c)) {
            ca = c;
          } else {
            ca.push(c);
          }
          this.commandChanged.next(ca);
        }

        // Handling host object
        if (action === 'DELETE' && object === 'HOST') {
          const h = JSON.parse(msg.data);
          this.hostDeleted.next(h);
        }

        if ((action === 'LOCK' || action === 'UNLOCK') && object === 'HOST') {
          const h = JSON.parse(msg.data);
          this.hostLocked.next(h);
        }

        if ((action === 'UPDATE' || action === 'CREATE' || action === 'GET') && object === 'HOST') {
          const h = JSON.parse(msg.data);
          let ha: Host[] = [];
          if (Array.isArray(h)) {
            ha = h;
          } else {
            ha.push(h);
          }
          this.hostChanged.next(ha);
        }

        // Handling history object


      },
      (err) => {
        this.online = false;
        this.clientId = 0;
        if (err.type.toUpperCase() === 'CLOSE') {
          this._socket.complete();
        } else {
          this._socket = undefined;
          console.log(err);
        }
      },
      () => {
        this._socket = undefined;
        this.clientId = 0;
        this.online = false;
        console.log('complete');
      }
    );

  }

  close() {
    this._socket.unsubscribe();
  }

  send(msg: SocketMessage) {
    this._socket.next(msg);
  }

}
