import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultiitemPackappPageRoutingModule } from './multiitem-packapp-routing.module';

import { MultiitemPackappPage } from './multiitem-packapp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MultiitemPackappPageRoutingModule
  ],
  declarations: [MultiitemPackappPage]
})
export class MultiitemPackappPageModule {}
