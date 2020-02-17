import { Component, OnInit } from '@angular/core';
import { UtilserviceService } from 'src/app/services/utilservice.service';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  userId: any;
  payments: any;

  constructor(
    public service: UtilserviceService,
    public menuCtrl: MenuController,
  ) {
    this.userId = localStorage.getItem('id');
  }

  ngOnInit() {
    this.getOrders();
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  goView(item: any) {
    this.service.navigate(this.service.ROUTES.order_view, {
      groupId: item.order_group_id,
      type: item.type,
      total: item.payment_total_value
    });

  }

  getOrders() {
    this.service.httpGet(`${this.service.URL_API.ORDERS_GROUP_BY_ID_GROUPED}/${this.userId}`, null).subscribe(
      res => {
        console.log(res.body);
        this.payments = res.body;
      },
      e => {
        console.log(e);
      }

    );
  }

}
