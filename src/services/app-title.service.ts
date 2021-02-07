import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class AppTitleService {

    constructor(private titleService: Title) { }

    public setTitle(newTitle: string): void {
        const currentTitle = this._getTitle();

        this.titleService.setTitle(`${currentTitle.split(':')[0]}: ${newTitle}`);
    }

    private _getTitle(): string {
        return this.titleService.getTitle();
    }
}