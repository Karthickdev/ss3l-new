import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultiItemPickappPageRoutingModule } from './multi-item-pickapp-routing.module';

import { MultiItemPickappPage } from './multi-item-pickapp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MultiItemPickappPageRoutingModule
  ],
  declarations: [MultiItemPickappPage]
})
export class MultiItemPickappPageModule {}
