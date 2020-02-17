import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { IonicModule } from '@ionic/angular';
import { OrderPage } from './order.page';
import { OrderViewComponent } from './order-view/order-view.component';

const routes: Routes = [
  {
    path: '',
    component: OrderPage
  },
  {
    path:'view',
    component: OrderViewComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccordionModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [OrderPage, OrderViewComponent]
})
export class OrderPageModule {}
