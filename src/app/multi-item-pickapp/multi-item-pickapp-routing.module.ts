import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultiItemPickappPage } from './multi-item-pickapp.page';

const routes: Routes = [
  {
    path: '',
    component: MultiItemPickappPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultiItemPickappPageRoutingModule {}
