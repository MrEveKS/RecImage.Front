import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PreviewComponent } from './preview/preview.component';
import { PointComponent } from './point/point.component';

import { APP_BASE_HREF } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

const appRoutes: Routes = [
    { path: '', component: AppComponent },
    { path: '**', redirectTo: '/' }
];
@NgModule({
    providers: [{ provide: APP_BASE_HREF, useValue: '' }],
    imports: [NgbCollapseModule, BrowserModule, FormsModule, HttpClientModule, RouterModule.forRoot(appRoutes), ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
    declarations: [AppComponent, PreviewComponent, PointComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }