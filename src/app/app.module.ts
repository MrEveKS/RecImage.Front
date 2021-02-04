import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../environments/environment';

import { MainModule } from './main/main.module';

import { AppComponent } from './app.component';
import { SpinnerComponent } from './spinner/spinner.component';
@NgModule({
    providers: [{ provide: APP_BASE_HREF, useValue: '' }],
    imports: [
        NgbDropdownModule,
        MainModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    declarations: [
        AppComponent,
        SpinnerComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }