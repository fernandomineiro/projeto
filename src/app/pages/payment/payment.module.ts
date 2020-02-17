import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaymentPage } from './payment.page';

import { PipeModule } from 'src/app/pipes/pipe.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

const routes: Routes = [
  {
    path: '',
    component: PaymentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipeModule,
    DirectivesModule,
    IonicModule,
    RouterModule.forChild(routes),
    
  ],
  declarations: [PaymentPage]
})
export class PaymentPageModule {}
