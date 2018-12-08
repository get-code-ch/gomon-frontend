import {Component, OnInit, Input} from '@angular/core';
import {JwtToken, User} from '../auth';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {

  @Input() title: string;

  token: JwtToken = {token: ''};
  user: User = {username: '', password: ''};

  constructor(private authenticateService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  onLoginClick(): void {
    this.authenticateService.loginUser(this.user)
      .subscribe(t => {
        this.token = t;
        this.router.navigate(['/dashboard']);
      });
  }
}


