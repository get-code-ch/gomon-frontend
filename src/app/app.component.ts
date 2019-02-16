import {Component, OnInit} from '@angular/core';
import {MessageService} from './message/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
   title = 'gomon';

  constructor(public msg: MessageService) {
  }

  ngOnInit() {
    if (!this.msg.online) {
      this.msg.connect();
    }
  }

}
