export class Command {

  constructor() {
    this.id = undefined;
    this.key = '';
    this.name = '';
    this.description = '';
    this.command = '';
    this.command_type = '';
    this.locked = false;
  }

  id: string;
  key: string;
  name: string;
  description: string;
  command: string;
  command_type: string;
  locked?: boolean;
}
