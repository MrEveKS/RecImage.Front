import {Component} from '@angular/core';

@Component({
    selector: 'nav-bar',
    styleUrls: ['./nav.component.scss'],
    templateUrl: './nav.component.html',
})
export class NavComponent {
    public isNavbarCollapsed = true;

    public toggleNavbar(): void {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }
}