import {Component, OnDestroy, OnInit} from '@angular/core';
import {HostService} from './host.service';
import {Host} from './host';
import {MessageService} from '../message/message.service';
import {LoggingService} from '../logging/logging.service';

@Component({
  selector: 'app-hosts',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit, OnDestroy  {

  constructor(private _hostService: HostService, private _msg: MessageService, private _logs: LoggingService) {
    this.hosts = _hostService.hosts;
  }

  public hosts: Host[];
  public workingHost: Host;
  private _saveHost: Host;

  static copy(src, dst) {
    dst.key = src.key;
    dst.name = src.name;
    dst.fqdn = src.fqdn;
    dst.ip = src.ip;
  }

  ngOnInit() {
    this.workingHost = new Host();
    this._saveHost = new Host();
    this._hostService.getHost();
  }

  // When we leaving component - Freeing locked probe;
  ngOnDestroy() {
    if (this.workingHost.locked) {
      this.workingHost.locked = false;
      this._logs.add('Unlock editing host (ignoring change) ' + this.workingHost.name);
      this._msg.send({action: 'UNLOCK', object: 'HOST', data: JSON.stringify(this.workingHost), error_code: 0, });
    }
  }


  undoClick() {
    this.workingHost.locked = false;
    this._msg.send({data: JSON.stringify(this.workingHost), action: 'UNLOCK', object: 'HOST', error_code: 0,});
    HostComponent.copy(this._saveHost, this.workingHost);

    this.workingHost = new Host();
    this._saveHost = new Host();
  }

  onFocus() {
    if (this.workingHost.fqdn !== '' && this.workingHost.ip === '') {
      this._hostService.getDNS(this.workingHost.fqdn).subscribe(data => {
        data.Answer.forEach((item) => {
            if (item.type === 1) {
              this.workingHost.ip = item.data;
              return;
            }
          }
        );
      }, error => {
        this.workingHost.ip = '';
        this._logs.add(error.error);
      });
    }
  }

  saveHostClick() {
    this.workingHost.locked = false;
    if (this.workingHost.id === '' || this.workingHost.id === undefined) {
      this.workingHost.id = undefined;
    } else {
      this._msg.send({data: JSON.stringify(this.workingHost), action: 'UNLOCK', object: 'HOST', error_code: 0,});
    }
    this._hostService.saveHost(this.workingHost);
    this.workingHost = new Host();
    this._saveHost = new Host();
  }

  editHostClick(h: Host) {
    if (this.workingHost.locked) {
      this.workingHost.locked = false;
      this._msg.send({data: JSON.stringify(this.workingHost), action: 'UNLOCK', object: 'HOST', error_code: 0,});
    }


    this.workingHost = h;
    this.workingHost.locked = true;
    this._msg.send({data: JSON.stringify(this.workingHost), action: 'LOCK', object: 'HOST', error_code: 0,});
    HostComponent.copy(this.workingHost, this._saveHost);
  }

  deleteHostClick(clickedHost: Host) {
    this._hostService.deleteHost(clickedHost);
  }

}
