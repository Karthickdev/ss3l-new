import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultiitemPackappPage } from './multiitem-packapp.page';

const routes: Routes = [
  {
    path: '',
    component: MultiitemPackappPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultiitemPackappPageRoutingModule {}
