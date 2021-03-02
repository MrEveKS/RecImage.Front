import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {ImageCollectionComponent} from "./image-collection.component";

@NgModule({
    imports: [CommonModule, RouterModule],
    declarations: [ImageCollectionComponent],
    exports: [ImageCollectionComponent],
})
export class ImageCollectionModule {
}