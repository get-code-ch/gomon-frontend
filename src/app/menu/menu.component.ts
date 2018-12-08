import {Component, Input, OnInit} from '@angular/core';
import { Menu} from '../menu';
import {AuthService} from '../auth.service';
import {MessageService} from '../message.service';
import {JwtToken} from '../auth';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menu: Menu[] = [{text: 'Home', link: '/'}, {text: 'Host', link: '/hosts'}];
  token: JwtToken = {token: ''};

  constructor(private authenticateService: AuthService, private messageService: MessageService) { }

  ngOnInit() {
    this.authenticateService.getToken()
      .subscribe(t => this.token = t);
    if (!this.authenticateService.authenticated) {
      this.messageService.add('logon please...');
    }

  }

}
