import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { GameComponent } from './game.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameMenuComponent } from './game-menu/game-menu.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

@NgModule({
    imports: [NgbDropdownModule, BrowserModule, FormsModule],
    declarations: [GameComponent, GameMenuComponent, GameBoardComponent, ProgressBarComponent],
    exports: [GameComponent]
})
export class GameModule { }