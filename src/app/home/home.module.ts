import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { ImageCollectionModule } from '../image-collection/image-collection.module';

import { HomeComponent } from './home.component';

@NgModule({
    imports: [CommonModule, HomeRoutingModule, ImageCollectionModule,],
    declarations: [HomeComponent,],
    exports: [HomeComponent,],
})
export class HomeModule { }