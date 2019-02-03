import { Component, OnInit } from '@angular/core';
import {LoggingService} from './logging.service';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.css']
})
export class LoggingComponent implements OnInit {

  _history = false;

  constructor(public logs: LoggingService) { }

  ngOnInit() {
  }

  toggleDisplayHistory() {
    this._history = !this._history;
  }
}
