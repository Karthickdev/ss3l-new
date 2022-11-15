import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackappMenusPageRoutingModule } from './packapp-menus-routing.module';

import { PackappMenusPage } from './packapp-menus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PackappMenusPageRoutingModule
  ],
  declarations: [PackappMenusPage]
})
export class PackappMenusPageModule {}
