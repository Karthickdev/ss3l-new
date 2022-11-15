import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickappMenusPageRoutingModule } from './pickapp-menus-routing.module';

import { PickappMenusPage } from './pickapp-menus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickappMenusPageRoutingModule
  ],
  declarations: [PickappMenusPage]
})
export class PickappMenusPageModule {}
