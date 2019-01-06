import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';


import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { MessageComponent } from './message/message.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HostComponent } from './host/host.component';
import { LiveViewComponent } from './live-view/live-view.component';
import { ProbeComponent } from './probe/probe.component';
import { CommandComponent } from './command/command.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr-CH';

registerLocaleData(localeFr, 'fr-CH');

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MessageComponent,
    DashboardComponent,
    HostComponent,
    LiveViewComponent,
    ProbeComponent,
    CommandComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
