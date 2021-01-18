import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { RouterModule, Routes } from '@angular/router';

import { PreviewComponent } from './preview/preview.component';

import { APP_BASE_HREF } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { PointComponent } from './point/point.component';
import { PointMenuComponent } from './point-menu/point-menu.component';
import { DevelopPreviewComponent } from './develop-preview/develop-preview.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { InformationComponent } from './preview/information/information.component';
import { ImageCollectionComponent } from './preview/image-collection/image-collection.component';
import { ImageSelectComponent } from './preview/image-select/image-select.component';

const appRoutes: Routes = [
    { path: '', component: AppComponent },
    { path: '**', redirectTo: '/' }
];
@NgModule({
    providers: [{ provide: APP_BASE_HREF, useValue: '' }],
    imports: [
        NgbDropdownModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    declarations: [
        AppComponent,
        PreviewComponent,
        PointComponent,
        ProgressBarComponent,
        PointMenuComponent,
        DevelopPreviewComponent,
        SpinnerComponent,
        InformationComponent,
        ImageCollectionComponent,
        ImageSelectComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }