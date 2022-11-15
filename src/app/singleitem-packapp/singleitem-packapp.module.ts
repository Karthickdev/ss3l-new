import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleitemPackappPageRoutingModule } from './singleitem-packapp-routing.module';

import { SingleitemPackappPage } from './singleitem-packapp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleitemPackappPageRoutingModule
  ],
  declarations: [SingleitemPackappPage]
})
export class SingleitemPackappPageModule {}
