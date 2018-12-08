import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent} from './login/login.component';
import { RouteGuardService} from './route-guard.service';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [RouteGuardService], pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [RouteGuardService] },
  { path: 'authorize', component: LoginComponent},
  { path: '**', component: DashboardComponent, canActivate: [RouteGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule { }
