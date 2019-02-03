import {Component, OnInit, OnDestroy, LOCALE_ID} from '@angular/core';
import {formatDate} from '@angular/common';

import {ProbeService} from './probe.service';
import {Probe} from './probe';
import {Host} from '../host/host';
import {Command} from '../command/command';
import {MessageService} from '../message/message.service';
import {HostService} from '../host/host.service';
import {CommandService} from '../command/command.service';
import {LoggingService} from '../logging/logging.service';

@Component({
  selector: 'app-probe',
  templateUrl: './probe.component.html',
  styleUrls: ['./probe.component.css'],
  providers: [
    {provide: LOCALE_ID, useValue: 'fr-CH'}
  ],

})
export class ProbeComponent implements OnInit, OnDestroy {

  constructor(private _probeService: ProbeService,
              private _hostService: HostService,
              private _commandService: CommandService,
              private _msg: MessageService,
              private _logs: LoggingService) {
    this.probes = _probeService.probes;
    this.hosts = _hostService.hosts;
    this.commands = _commandService.commands;
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
    this._logs.add('Loading probe table...');

    // Get Probes List
    this._probeService.getProbe();

    // Get commands List
    if (this._commandService.commands.length < 1) {
      this._commandService.getCommand();
    }

    // Get hosts List
    if (this._hostService.hosts.length < 1) {
      this._hostService.getHost();
    }
  }

  // When we leaving component - Freeing locked probe;
  ngOnDestroy() {
    if (this.workingProbe.locked) {
      this.workingProbe.locked = false;
      this._logs.add('Unlock editing probe (ignoring change) ' + this.workingProbe.name);

      // Convert date String to ISOString Date format
      this.workingProbe.next = new Date(this.workingProbe.next).toISOString();
      this.workingProbe.last = new Date(this.workingProbe.last).toISOString();

      this._msg.send({action: 'UNLOCK', object: 'PROBE', data: JSON.stringify(this.workingProbe), error_code: 0,});
    }
  }

  hostName(id) {
    if (this.hosts.length > 0) {
      return (this.hosts.find(x => x.id === id)).name;
    } else {
      return undefined;
    }
  }

  commandName(id) {
    if (this.commands.length > 0) {
      return (this.commands.find(x => x.id === id)).name;
    } else {
      return undefined;
    }
  }

  undoClick() {
    this.workingProbe.locked = false;

    // Convert date String to ISOString Date format
    this.workingProbe.next = new Date(this.workingProbe.next).toISOString();
    this.workingProbe.last = new Date(this.workingProbe.last).toISOString();

    this._msg.send({data: JSON.stringify(this.workingProbe), action: 'UNLOCK', object: 'PROBE', error_code: 0,});

    ProbeComponent.copy(this._saveProbe, this.workingProbe);
    this.workingProbe = new Probe();
    this._saveProbe = new Probe();
    this.workingProbe.next = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'fr-CH');
    this.workingProbe.last = formatDate(new Date(2001, 1, 1, 0, 0, 0, 0), 'yyyy-MM-ddTHH:mm:ss', 'fr-CH');
  }

  saveProbeClick() {
    this.workingProbe.locked = false;
    if (this.workingProbe.id === '' || this.workingProbe.id === undefined) {
      this.workingProbe.id = undefined;
    } else {
      this.workingProbe.next = new Date(this.workingProbe.next).toISOString();
      this.workingProbe.last = new Date(this.workingProbe.last).toISOString();

      this._msg.send({data: JSON.stringify(this.workingProbe), action: 'UNLOCK', object: 'PROBE', error_code: 0,});
    }
    this._probeService.saveProbe(this.workingProbe);
    this.workingProbe = new Probe();
    this._saveProbe = new Probe();
  }

  editProbeClick(p: Probe) {
    if (this.workingProbe.locked) {
      this.workingProbe.locked = false;

      // Convert date String to ISOString Date format
      this.workingProbe.next = new Date(this.workingProbe.next).toISOString();
      this.workingProbe.last = new Date(this.workingProbe.last).toISOString();

      this._msg.send({data: JSON.stringify(this.workingProbe), action: 'UNLOCK', object: 'PROBE', error_code: 0,});
    }


    this.workingProbe = p;
    this.workingProbe.locked = true;

    // Convert date String to ISOString Date format
    this.workingProbe.next = new Date(this.workingProbe.next).toISOString();
    this.workingProbe.last = new Date(this.workingProbe.last).toISOString();

    this._msg.send({data: JSON.stringify(this.workingProbe), action: 'LOCK', object: 'PROBE', error_code: 0,});

    ProbeComponent.copy(this.workingProbe, this._saveProbe);

  }

  deleteProbeClick(clickedProbe: Probe) {
    this._probeService.deleteProbe(clickedProbe);
  }

}
