import {Component, OnInit} from '@angular/core';
import {Menu} from './menu';
import {AuthService} from '../auth/auth.service';
import {MessageService} from '../message/message.service';
import {environment} from '../../environments/environment';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public clock;
  public env;

  menu: Menu[] = [
    {text: 'Home', link: '/'},
    {text: 'Live View', link: '/liveview'},
    {text: 'Probe', link: '/probe'},
    {text: 'Host', link: '/host'},
    {text: 'Command', link: '/command'},
  ];

  constructor(public authenticateService: AuthService, public msg: MessageService) { }

  ngOnInit() {
    if (environment.production) {
      this.env = 'PRODUCTION';
    } else {
      this.env = 'DEV';
    }
    setInterval(() => {
      // const time = new Date();
      this.clock = new Date();
    }, 1000);

  }

}
