export class Host {

  constructor() {
    this.id = undefined;
    this.key = '';
    this.name = '';
    this.fqdn = '';
    this.ip = '';
    this.locked = false;
  }

  id: string;
  key: string;
  name: string;
  fqdn: string;
  ip: string;
  locked?: boolean;
}
