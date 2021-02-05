import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColoringRoutingModule } from './coloring-routing.module';

import { ColoringComponent } from './coloring.component';

@NgModule({
    imports: [ColoringRoutingModule, CommonModule, ColoringRoutingModule],
    declarations: [ColoringComponent,]
})
export class ColoringModule {
    
 }