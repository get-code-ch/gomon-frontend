import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouteGuardService} from './route-guard.service';
import {HostComponent} from './host/host.component';
import {LiveViewComponent} from './live-view/live-view.component';
import {ProbeComponent} from './probe/probe.component';
import {CommandComponent} from './command/command.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'host', component: HostComponent, canActivate: [RouteGuardService]},
  { path: 'probe', component: ProbeComponent, canActivate: [RouteGuardService]},
  { path: 'command', component: CommandComponent, canActivate: [RouteGuardService]},
  { path: 'liveview', component: LiveViewComponent, canActivate: [RouteGuardService]},
  { path: '**', component: DashboardComponent, canActivate: [RouteGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule { }
