import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommandService} from './command.service';
import {Command} from './command';
import {MessageService} from '../message/message.service';
import {LoggingService} from '../logging/logging.service';

@Component({
  selector: 'app-command',
  templateUrl: './command.component.html',
  styleUrls: ['./command.component.css']
})
export class CommandComponent implements OnInit, OnDestroy {

  constructor(private _commandService: CommandService, private _msg: MessageService, private _logs: LoggingService) {
    this.commands = _commandService.commands;
  }

  public commands: Command[];
  public workingCommand: Command;
  private _saveCommand: Command;

  static copy(src, dst) {
    dst.key = src.key;
    dst.name = src.name;
    dst.description = src.description;
    dst.command = src.command;
    dst.command_type = src.command_type;
  }

  ngOnInit() {
    this.workingCommand = new Command();
    this._saveCommand = new Command();
    this._commandService.getCommand();
  }

  // When we leaving component - Freeing locked probe;
  ngOnDestroy() {
    if (this.workingCommand.locked) {
      this.workingCommand.locked = false;
      this._logs.add('Unlock editing command (ignoring change) ' + this.workingCommand.name);
      this._msg.send({action: 'UNLOCK', object: 'COMMAND', data: JSON.stringify(this.workingCommand), error_code: 0,});
    }
  }

  undoClick() {
    this.workingCommand.locked = false;
    this._msg.send({data: JSON.stringify(this.workingCommand), action: 'UNLOCK', object: 'COMMAND', error_code: 0,});
    CommandComponent.copy(this._saveCommand, this.workingCommand);

    this.workingCommand = new Command();
    this._saveCommand = new Command();
  }

  saveCommandClick() {
    this.workingCommand.locked = false;
    if (this.workingCommand.id === '' || this.workingCommand.id === undefined) {
      this.workingCommand.id = undefined;
    } else {
      this._msg.send({data: JSON.stringify(this.workingCommand), action: 'UNLOCK', object: 'COMMAND', error_code: 0,});
    }
    this._commandService.saveCommand(this.workingCommand);
    this.workingCommand = new Command();
    this._saveCommand = new Command();
  }

  editCommandClick(c: Command) {
    if (this.workingCommand.locked) {
      this.workingCommand.locked = false;
      this._msg.send({data: JSON.stringify(this.workingCommand), action: 'UNLOCK', object: 'COMMAND', error_code: 0,});
    }

    this.workingCommand = c;
    this.workingCommand.locked = true;
    this._msg.send({data: JSON.stringify(this.workingCommand), action: 'LOCK', object: 'COMMAND', error_code: 0,});
    CommandComponent.copy(this.workingCommand, this._saveCommand);
  }

  deleteCommandClick(clickedCommand: Command) {
    this._commandService.deleteCommand(clickedCommand);
  }

}
