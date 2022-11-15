import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleitemPickappPageRoutingModule } from './singleitem-pickapp-routing.module';

import { SingleitemPickappPage } from './singleitem-pickapp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleitemPickappPageRoutingModule
  ],
  declarations: [SingleitemPickappPage]
})
export class SingleitemPickappPageModule {}
