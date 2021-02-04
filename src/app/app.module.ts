import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { APP_BASE_HREF, CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { NavComponent } from './nav/nav.component';
import { FooterSelectComponent } from './footer/footer-select/footer-select.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
    providers: [
        { provide: APP_BASE_HREF, useValue: '' },
        { provide: LocationStrategy, useClass: PathLocationStrategy }
    ],
    imports: [
        CommonModule,
        AppRoutingModule,
        NgbDropdownModule,
        NgbCollapseModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    declarations: [
        AppComponent,
        SpinnerComponent,
        NavComponent,
        FooterComponent,
        FooterSelectComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }