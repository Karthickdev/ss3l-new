import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleitemPackappPage } from './singleitem-packapp.page';

const routes: Routes = [
  {
    path: '',
    component: SingleitemPackappPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleitemPackappPageRoutingModule {}
