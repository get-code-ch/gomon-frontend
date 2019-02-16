import {Component, OnInit} from '@angular/core';
import {MessageService} from '../message/message.service';
import {LoggingService} from '../logging/logging.service';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.css']
})

export class LiveViewComponent implements OnInit {

  public broadcastTxt: string;
  public echoTxt: string;

  constructor(public msg: MessageService, public logs: LoggingService) {
  }

  ngOnInit() {
    if (!this.msg.online) {
      this.msg.connect();
    }
  }

  sendBtnClick() {
    this.msg.send({data: this.echoTxt, action: 'ECHO', error_code: 0, object: '',});
  }

  broadcastBtnClick() {
    this.msg.send({data: this.broadcastTxt, action: 'BROADCAST', error_code: 0, object: '',});
  }

}
