import {Component, Input, OnInit} from '@angular/core';
import {JwtToken, User} from '../auth';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input() title: string;

  token: JwtToken = {token: '', msg: ''};
  user: User = {username: '', password: ''};

  constructor(public authenticateService: AuthService, private _activatedRoute: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
    this.token = this.authenticateService.getToken()

    // Logout path interception
    this._activatedRoute.url.subscribe(data => {
      const u = data;

      if (u !== undefined && u.length > 0 && u[0].path.toString() === 'logout') {
        this.authenticateService.logoutUser();
        this._router.navigate(['/'], { skipLocationChange: true });
      }
    });
  }

  onLoginClick() {
    this.authenticateService.loginUser(this.user).subscribe();
  }

}
