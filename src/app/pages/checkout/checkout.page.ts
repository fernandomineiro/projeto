import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UtilserviceService } from 'src/app/services/utilservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  orderCart: any;
  totalOrder: any;
  
  constructor(
    private _goBack: Location,
    public service: UtilserviceService
  ) { }

  ngOnInit() {
    this.getOrdersToCard();
  }

  goBack() {
    this._goBack.back();
  }

  goPayment() {
    this.service.navigate(this.service.ROUTES.payment, null);
  }

  getOrdersToCard() {
    let id = localStorage.getItem('orderGroupId');

    this.service.httpGet(`${this.service.URL_API.ORDERS_TO_CART}/${id}`, null).subscribe(
      res => {
        this.orderCart = res.body;
        console.log(this.orderCart);
        
        if (this.orderCart.count > 0) {
          this.totalOrder = this.orderCart['rows'].reduce(function (a, b) {
            return a + b['total_price'];
          }, 0);
        }
      },
      e => {
        console.log(e);
      }
    );

  }

  deleteOrder(ordered) {
    Swal.fire({
      title: 'Deletar pedido?',
      html: `
      <h4>${ordered.product.product_name}</h4>
      <h5>quantidade:${ordered.qtd}</h5>
      <h6>${this.service.formatCurrency(ordered.total_price)}</h6>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6E9E6A',
      cancelButtonColor: '#DC4C3F',
      confirmButtonText: 'CONFIRMA',
      cancelButtonText: 'CANCELAR'
    }).then((result) => {
      if (result.value) {

        this.service.httpDelete(`${this.service.URL_API.ORDER_DELETE}/${ordered.order_id}`, null).subscribe(
          () => {
            Swal.fire(
              'Sucesso!',
              'Registro deletado.',
              'success'
            )
            this.getOrdersToCard();
          },
          e => {
            Swal.fire(
              'Erro!',
              e.error.message,
              'error'
            )
          }
        );
      }
    })
  }

}
