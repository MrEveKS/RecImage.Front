import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SafeUrlPipe } from './pipes/safe-url.pipe';

import { GameComponent } from './game.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameMenuComponent } from './game-menu/game-menu.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { GameEndComponent } from './game-end/game-end.component';

@NgModule({
    imports: [NgbDropdownModule, BrowserModule, FormsModule],
    declarations: [
        SafeUrlPipe,
        GameComponent,
        GameMenuComponent,
        GameBoardComponent,
        ProgressBarComponent,
        GameEndComponent,
    ],
    exports: [GameComponent]
})
export class GameModule { }