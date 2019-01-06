import {Component, OnInit} from '@angular/core';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  _history = false;

  constructor(public messageService: MessageService) {
  }

  ngOnInit() {
  }

  toggleDisplayHistory() {
    this._history = !this._history;
  }
}
