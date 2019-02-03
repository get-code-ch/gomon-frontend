import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  public logs: string[] = [];

  constructor() { }

// TODO: Usage configuration to define max Messages buffer
  add(message: string) {
    if (this.logs.length > 1000) {
      this.logs.shift();
    }
    this.logs.push(message);
  }

  clear() {
    this.logs = [];
    this.add('log cleared');
  }
}


