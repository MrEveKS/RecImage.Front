import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { RouterModule } from '@angular/router';

import { MainComponent } from './main.component';
import { NavComponent } from '../nav/nav.component';

import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { ImageCollectionComponent } from '../image-collection/image-collection.component';
import { FooterComponent } from '../footer/footer.component';
import { FooterSelectComponent } from '../footer/footer-select/footer-select.component';
import { ColoringComponent } from '../coloring/coloring.component';

import { appRoutes } from './main.routes';

@NgModule({
    imports: [NgbCollapseModule, BrowserModule, FormsModule, RouterModule.forRoot(appRoutes),],
    declarations: [
        MainComponent,
        NavComponent,
        HomeComponent,
        AboutComponent,
        ContactComponent,
        ImageCollectionComponent,
        FooterComponent,
        FooterSelectComponent,
        ColoringComponent,
    ],
    exports: [MainComponent,],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainModule { }