import {Component, OnInit} from '@angular/core';
import {Menu} from '../menu';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menu: Menu[] = [
    {text: 'Home', link: '/'},
    {text: 'Live View', link: '/liveview'},
    {text: 'Probe', link: '/probe'},
    {text: 'Host', link: '/host'},
    {text: 'Command', link: '/command'},
  ];

  constructor(public authenticateService: AuthService) {
  }

  ngOnInit() {
  }

}
