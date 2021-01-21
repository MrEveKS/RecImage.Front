import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { RouterModule, Routes } from '@angular/router';

import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../environments/environment';

import { GameModule } from './game/game.module';
import { PreviewModule } from './preview/preview.module';

import { AppComponent } from './app.component';
import { SpinnerComponent } from './spinner/spinner.component';

const appRoutes: Routes = [
    { path: '', component: AppComponent },
    { path: '**', redirectTo: '/' }
];
@NgModule({
    providers: [{ provide: APP_BASE_HREF, useValue: '' }],
    imports: [
        GameModule,
        PreviewModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    declarations: [
        AppComponent,
        SpinnerComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }