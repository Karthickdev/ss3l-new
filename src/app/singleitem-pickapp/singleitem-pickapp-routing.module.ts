import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleitemPickappPage } from './singleitem-pickapp.page';

const routes: Routes = [
  {
    path: '',
    component: SingleitemPickappPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleitemPickappPageRoutingModule {}
