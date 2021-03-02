import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ColoringComponent} from './coloring.component';

const routes: Routes = [
    {path: ':id', component: ColoringComponent},
    {path: '', component: ColoringComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ColoringRoutingModule {
}