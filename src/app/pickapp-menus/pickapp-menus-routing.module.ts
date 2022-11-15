import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickappMenusPage } from './pickapp-menus.page';

const routes: Routes = [
  {
    path: '',
    component: PickappMenusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickappMenusPageRoutingModule {}
