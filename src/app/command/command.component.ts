import {Component, OnInit} from '@angular/core';
import {CommandService} from '../command.service';
import {Command} from '../command';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-command',
  templateUrl: './command.component.html',
  styleUrls: ['./command.component.css']
})
export class CommandComponent implements OnInit {

  constructor(private _commandService: CommandService, private _msg: MessageService) {
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
    this._commandService.getCommand().subscribe(result => {
      this._msg.add('Command table loaded');
      this.commands = result;
    }, error => this._msg.add(error.error));
  }

  undoClick() {
    CommandComponent.copy(this._saveCommand, this.workingCommand);
    this.workingCommand = new Command();
    this._saveCommand = new Command();
  }

  saveCommandClick() {
    if (this.workingCommand.id === '' || this.workingCommand.id === undefined) {
      this.workingCommand.id = undefined;
      this._commandService.saveCommand(this.workingCommand).subscribe(c => {
        this.commands.push(c);
        this._msg.add('Command ' + c.key + ' inserted');
        this.workingCommand = c;
        CommandComponent.copy(this.workingCommand, this._saveCommand);
      }, error => this._msg.add(error.error));
    } else {
      this._commandService.saveCommand(this.workingCommand).subscribe(c => {
          this._msg.add('Command ' + c.key + ' updated');
          this.workingCommand = c;
          CommandComponent.copy(this.workingCommand, this._saveCommand);
        },
        error => this._msg.add(error.error));
    }
  }

  editCommandClick(c: Command) {
    this.workingCommand = c;
    CommandComponent.copy(this.workingCommand, this._saveCommand);
  }

  deleteCommandClick(clickedCommand: Command) {
    this._commandService.deleteCommand(clickedCommand).subscribe(host => {
      this._msg.add(clickedCommand.key + 'Deleted');
      const idx = this.commands.indexOf(clickedCommand);
      if (idx > -1) {
        this.commands.splice(idx, 1);
        this.workingCommand = new Command();
      }
    }, error => this._msg.add(error.error));
  }

}
