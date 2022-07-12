import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ColoringRoutingModule } from './coloring-routing.module';

import { ColoringComponent } from './coloring.component';
import { ColoringMenuComponent } from './coloring-menu/coloring-menu.component';
import { ColoringBoardComponent } from './coloring-board/coloring-board.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  imports: [
    ColoringRoutingModule,
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatSliderModule,
  ],
  declarations: [
    ColoringComponent,
    ColoringMenuComponent,
    ProgressBarComponent,
    ColoringBoardComponent,
    SpinnerComponent,
  ],
})
export class ColoringModule {}
