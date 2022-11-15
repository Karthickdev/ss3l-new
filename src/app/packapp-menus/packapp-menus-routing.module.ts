import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackappMenusPage } from './packapp-menus.page';

const routes: Routes = [
  {
    path: '',
    component: PackappMenusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackappMenusPageRoutingModule {}
