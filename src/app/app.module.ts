import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MetrikaModule } from 'ng-yandex-metrika';

import { APP_BASE_HREF, CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FooterSelectComponent } from './footer/footer-select/footer-select.component';
import { FooterComponent } from './footer/footer.component';

const yaMetrikId = environment.production ? 70474984 : 72180016;

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
        MetrikaModule.forRoot({
            id: yaMetrikId, webvisor: true, clickmap: true,
        }),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    declarations: [
        AppComponent,
        NavComponent,
        FooterComponent,
        FooterSelectComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
/*
    params?: any;
    clickmap?: boolean;
    trackLinks?: boolean;
    accurateTrackBounce?: boolean;
    webvisor?: boolean;
    trackHash?: boolean;
    ut?: string;
    ecommerce?: string;
    triggerEvent?: boolean;
    alternative?: boolean;

*/