import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const mainRoutes: Routes = [
    { path: 'about', loadChildren: () => import('./about/about-routing.module').then(m => m.AboutRoutingModule) },
    { path: 'contact', loadChildren: () => import('./contact/contact-routing.module').then(m => m.ContactRoutingModule) },
    { path: 'coloring', loadChildren: () => import('./coloring/coloring.module').then(m => m.ColoringModule) },
    { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [RouterModule.forRoot(mainRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }