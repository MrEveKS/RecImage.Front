import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


import { ColoringRoutingModule } from './coloring-routing.module';

import { ColoringComponent } from './coloring.component';
import { ColoringMenuComponent } from './coloring-menu/coloring-menu.component';
import { ColoringBoardComponent } from './coloring-board/coloring-board.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

@NgModule({
    imports: [
        NgbDropdownModule,
        ColoringRoutingModule,
        CommonModule,
        FormsModule,
        ColoringRoutingModule
    ],
    declarations: [ColoringComponent, ColoringMenuComponent, ProgressBarComponent, ColoringBoardComponent]
})
export class ColoringModule {
}