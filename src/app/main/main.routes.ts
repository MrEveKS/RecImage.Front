import { Routes } from "@angular/router";

export const appRoutes: Routes = [
    { path: '', loadChildren: () => import('../home/home.module').then(m => m.HomeModule) },
    { path: 'about', loadChildren: () => import('../about/about.module').then(m => m.AboutModule) },
    { path: 'contact', loadChildren: () => import('../contact/contact.module').then(m => m.ContactModule) },
    { path: 'coloring', loadChildren: () => import('../coloring/coloring.module').then(m => m.ColoringModule) },
    { path: '**', redirectTo: '/' }
];
