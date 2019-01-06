import {Component, OnInit, LOCALE_ID} from '@angular/core';
import {formatDate} from '@angular/common';

import {ProbeService} from '../probe.service';
import {Probe} from '../probe';
import {Host} from '../host';
import {Command} from '../command';
import {MessageService} from '../message.service';
import {HostService} from '../host.service';
import {CommandService} from '../command.service';

@Component({
  selector: 'app-probe',
  templateUrl: './probe.component.html',
  styleUrls: ['./probe.component.css'],
  providers: [
    {provide: LOCALE_ID, useValue: 'fr-CH'}
  ],

})
export class ProbeComponent implements OnInit {

  constructor(private _probeService: ProbeService,
              private _hostService: HostService,
              private _commandService: CommandService,
              private _msg: MessageService) {
  }

  public probes: Probe[];
  public workingProbe: Probe;
  public hosts: Host[];
  public commands: Command[];
  private _saveProbe: Probe;

  static copy(src, dst) {
    dst.id = src.id;
    dst.host_id = src.host_id;
    dst.command_id = src.command_id;
    dst.name = src.name;
    dst.description = src.description;
    dst.interval = src.interval;
    dst.next = src.next;
    dst.last = src.last;
    dst.result = src.result;
    dst.state = src.state;
  }

  ngOnInit() {
    this.workingProbe = new Probe();
    this._saveProbe = new Probe();
    this.workingProbe.next = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'fr-CH');
    this.workingProbe.last = formatDate(new Date(2001, 1, 1, 0, 0, 0, 0), 'yyyy-MM-ddTHH:mm:ss', 'fr-CH');
    this._msg.add('Loading probe table...');

    this._probeService.getProbe().subscribe(result => {
      this._msg.add('Probe table loaded');
      this.probes = result;
    }, error => this._msg.add(error.error));

    // Get commands List
    this._commandService.getCommand().subscribe(result => {
      this._msg.add('Command table loaded');
      this.commands = result;
    }, error => this._msg.add(error.error));

    // Get hosts List
    this._hostService.getHosts().subscribe(result => {
      this._msg.add('Host table loaded');
      this.hosts = result;
    }, error => this._msg.add(error.error));
  }

  hostName(id) {
    if (this.hosts != null) {
      return (this.hosts.find(x => x.id === id)).name;
    } else {
      return null;
    }
  }

  commandName(id) {
    if (this.commands != null) {
      return (this.commands.find(x => x.id === id)).name;
    } else {
      return null;
    }
  }

  undoClick() {
    ProbeComponent.copy(this._saveProbe, this.workingProbe);
    this.workingProbe = new Probe();
    this._saveProbe = new Probe();
    this.workingProbe.next = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'fr-CH');
    this.workingProbe.last = formatDate(new Date(2001, 1, 1, 0, 0, 0, 0), 'yyyy-MM-ddTHH:mm:ss', 'fr-CH');
  }

  saveProbeClick() {
    if (this.workingProbe.id === '' || this.workingProbe.id === undefined) {
      this.workingProbe.id = undefined;
      this._probeService.saveProbe(this.workingProbe).subscribe(p => {
        this.probes.push(p);
        this._msg.add('Probe ' + p.name + ' inserted');
        this.workingProbe = p;

        this.workingProbe.next = formatDate(new Date(this.workingProbe.next), 'yyyy-MM-ddTHH:mm:ss', 'fr-CH');
        this.workingProbe.last = formatDate(new Date(this.workingProbe.last), 'yyyy-MM-ddTHH:mm:ss', 'fr-CH');

        ProbeComponent.copy(this.workingProbe, this._saveProbe);

      }, error => this._msg.add(error.error));
    } else {
      this._probeService.saveProbe(this.workingProbe).subscribe(p => {
          this._msg.add('Probe ' + p.name + ' updated');
          this.workingProbe = p;

          this.workingProbe.next = formatDate(new Date(this.workingProbe.next), 'yyyy-MM-ddTHH:mm:ss', 'fr-CH');
          this.workingProbe.last = formatDate(new Date(this.workingProbe.last), 'yyyy-MM-ddTHH:mm:ss', 'fr-CH');

          ProbeComponent.copy(this.workingProbe, this._saveProbe);

        },
        error => this._msg.add(error.error));
    }
  }

  editProbeClick(p: Probe) {
    this.workingProbe = p;

    this.workingProbe.next = formatDate(this.workingProbe.next, 'yyyy-MM-ddTHH:mm:ss', 'fr-CH');
    this.workingProbe.last = formatDate(this.workingProbe.last, 'yyyy-MM-ddTHH:mm:ss', 'fr-CH');

    ProbeComponent.copy(this.workingProbe, this._saveProbe);

  }

  deleteProbeClick(clickedProbe: Probe) {
    this._probeService.deleteProbe(clickedProbe).subscribe(p => {
      this._msg.add(clickedProbe.name + 'Deleted');
      const idx = this.probes.indexOf(clickedProbe);
      if (idx > -1) {
        this.probes.splice(idx, 1);
        this.workingProbe = new Probe();
      }
    }, error => this._msg.add(error.error));
  }

}
