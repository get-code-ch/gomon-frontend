export class Probe {

  constructor() {
    this.id = undefined;
    this.host_id = undefined;
    this.command_id = undefined;
    this.name = '';
    this.description = '';
    this.interval = undefined;

    this.next = undefined;
    this.last = undefined;
    this.result = '';
    this.state = '';
    this.locked = false;
  }

  id: string;
  host_id: string;
  command_id: string;
  name: string;
  description?: string;
  interval?: number;
  next?: string;
  last?: string;
  result?: string;
  state?: string;
  locked?: boolean;

}
