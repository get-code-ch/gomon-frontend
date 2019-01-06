import {Component, OnInit} from '@angular/core';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.css']
})

export class LiveViewComponent implements OnInit {

  public broadcastTxt: string;
  public echoTxt: string;

  constructor(public messageService: MessageService) {
  }

  ngOnInit() {
    this.messageService.connect();
  }

  sendBtnClick() {
    this.messageService.send({data: this.echoTxt, action: 'ECHO', error_code: 0, });
  }

  broadcastBtnClick() {
    this.messageService.send({data: this.broadcastTxt, action: 'BROADCAST',  error_code: 0, });
  }

}
