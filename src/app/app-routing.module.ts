import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'pickapp-menus',
    loadChildren: () => import('./pickapp-menus/pickapp-menus.module').then( m => m.PickappMenusPageModule)
  },
  {
    path: 'packapp-menus',
    loadChildren: () => import('./packapp-menus/packapp-menus.module').then( m => m.PackappMenusPageModule)
  },
  {
    path: 'singleitem-pickapp',
    loadChildren: () => import('./singleitem-pickapp/singleitem-pickapp.module').then( m => m.SingleitemPickappPageModule)
  },
  {
    path: 'multi-item-pickapp',
    loadChildren: () => import('./multi-item-pickapp/multi-item-pickapp.module').then( m => m.MultiItemPickappPageModule)
  },
  {
    path: 'singleitem-packapp',
    loadChildren: () => import('./singleitem-packapp/singleitem-packapp.module').then( m => m.SingleitemPackappPageModule)
  },
  {
    path: 'multiitem-packapp',
    loadChildren: () => import('./multiitem-packapp/multiitem-packapp.module').then( m => m.MultiitemPackappPageModule)
  },
  {
    path: 'print',
    loadChildren: () => import('./print/print.module').then( m => m.PrintPageModule)
  },
  {
    path: 'tracking',
    loadChildren: () => import('./tracking/tracking.module').then( m => m.TrackingPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
