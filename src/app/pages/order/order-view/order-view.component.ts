import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilserviceService } from 'src/app/services/utilservice.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss'],
})
export class OrderViewComponent implements OnInit {
  order: any;
  totalOrder: any;
  payments: any;
  idUser: any;
  type: any;
  total: any;
  constructor(
    private ActivatedRoute: ActivatedRoute,
    public service: UtilserviceService,
    private _goBack: Location,
  ) { }

  ngOnInit() {
    this.ActivatedRoute.params.subscribe(params => {
      this.getOrdersToCard(params.groupId);
      this.total = params.total;
      this.type = params.type;
      console.log(this.type);

    });
  }

  goBack() {
    this._goBack.back();
  }

  goPrductSilgle(id) {
    this.service.navigate(this.service.ROUTES.product_single, { id });
  }

  getOrdersToCard(id: string) {
    this.service.httpGet(`${this.service.URL_API.ORDERS_TO_CART}/${id}`, null).subscribe(
      res => {
        this.order = res.body;
        if (this.order.count > 0) {
          this.totalOrder = this.order['rows'].reduce(function (a, b) {
            return a + b['total_price'];
          }, 0);
          this.service.httpGet(`${this.service.URL_API.ORDERS_GROUP_BY_ID_LIST}/${id}`, null).subscribe(
            res => {
              console.log(res.body);
              this.payments = res.body;
            },
            e => {
              console.log(e);
            }

          );
        }
      },
      e => {
        console.log(e);
      }
    );

  }

}
