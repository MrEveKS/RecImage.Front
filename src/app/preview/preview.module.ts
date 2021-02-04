import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { PreviewComponent } from './preview.component';
import { ImageSelectComponent } from './image-select/image-select.component';
import { ImageCollectionComponent } from '../image-collection/image-collection.component';

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [PreviewComponent, ImageSelectComponent, ImageCollectionComponent],
    exports: [PreviewComponent]
})
export class PreviewModule { }