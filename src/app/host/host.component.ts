import {Component, OnInit} from '@angular/core';
import {HostService} from '../host.service';
import {Host} from '../host';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-hosts',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit {

  constructor(private _hostsService: HostService, private _msg: MessageService) {
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
    this._hostsService.getHosts().subscribe(result => {
      this._msg.add('Host table loaded');
      this.hosts = result;
    }, error => this._msg.add(error.error));
  }

  undoClick() {
    HostComponent.copy(this._saveHost, this.workingHost);

    this.workingHost = new Host();
    this._saveHost = new Host();
  }

  onFocus() {
    if (this.workingHost.fqdn !== '' && this.workingHost.ip === '') {
      this._hostsService.getDNS(this.workingHost.fqdn).subscribe(data => {
        data.Answer.forEach((item) => {
            if (item.type === 1) {
              this.workingHost.ip = item.data;
              return;
            }
          }
        );
      }, error => {
        this.workingHost.ip = '';
        this._msg.add(error.error);
      });
    }
  }

  saveHostClick() {
    if (this.workingHost.id === '' || this.workingHost.id === undefined) {
      this.workingHost.id = undefined;
      this._hostsService.saveHost(this.workingHost).subscribe(h => {
        this.hosts.push(h);
        this._msg.add('Host ' + h.key + ' inserted');
        this.workingHost = h;
        HostComponent.copy(this.workingHost, this._saveHost);
      }, error => this._msg.add(error.error));
    } else {
      this._hostsService.saveHost(this.workingHost).subscribe(h => {
          this._msg.add('Host ' + h.key + ' updated');
          this.workingHost = h;
          HostComponent.copy(this.workingHost, this._saveHost);
        },
        error => this._msg.add(error.error));
    }
  }

  editHostClick(h: Host) {
    this.workingHost = h;
    HostComponent.copy(this.workingHost, this._saveHost);
  }

  deleteHostClick(clickedHost: Host) {
    this._hostsService.deleteHost(clickedHost).subscribe(host => {
      this._msg.add(clickedHost.key + 'Deleted');
      const idx = this.hosts.indexOf(clickedHost);
      if (idx > -1) {
        this.hosts.splice(idx, 1);
        this.workingHost = new Host();
      }
    }, error => this._msg.add(error.error));
  }

}
