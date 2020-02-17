import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UtilserviceService } from 'src/app/services/utilservice.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import * as moment from 'moment';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  @ViewChild("blockOne", { static: false }) blockOne: ElementRef;
  @ViewChild("blockTwo", { static: false }) blockTwo: ElementRef;
  @ViewChild("blockThree", { static: false }) blockThree: ElementRef;
  @ViewChild("blockFour", { static: false }) blockFour: ElementRef;
  @ViewChild("blockFive", { static: false }) blockFive: ElementRef;
  @ViewChild("blockSix", { static: false }) blockSix: ElementRef;

  blockTypeOne: any;
  blockTypeTwo: any;
  blockTypeThree: any;
  blockTypeFour: any;
  blockTypeFive: any;
  blockTypeSix: any;
  numberCard: any;




  load = false;
  orderCart: any;
  totalOrder: any;
  formDebito: string;
  formBoleto: string;
  debitCard = false;
  boleto = false;
  creditCard = false;
  showButton = false;
  card: any;
  groupId: string;
  userId: any;
  constructor(
    private _goBack: Location,
    public service: UtilserviceService
  ) {
    console.log(this.blockTwo);
    this.groupId = localStorage.getItem("orderGroupId");
    this.userId = localStorage.getItem('id');

  }

  ngOnInit() {
    this.getOrdersToCard()
  }

  // #region

  goBack() {
    this._goBack.back();
  }

  choosePay(n: number) {
    this.formBoleto = null;
    this.formDebito = null;
    this.showButton = false;
    switch (n) {
      case 1:
        this.debitCard = false;
        this.boleto = false;
        this.creditCard = true;
        this.showButton = false;
        break;
      case 2:
        this.debitCard = true;
        this.boleto = false;
        this.creditCard = false;
        this.showButton = true;
        break;
      case 3:
        this.debitCard = false;
        this.boleto = true;
        this.creditCard = false;
        this.showButton = false;
        break;
    }
  }

  chooseForm() {
    this.showButton = true;
  }

  inputingOne() {
    if (this.blockTypeOne.length === 4) {
      this.blockTwo.nativeElement.focus();
    }
  }

  inputingTwo() {

    if (this.blockTypeTwo.length === 4) {
      this.blockThree.nativeElement.focus();
    }
  }

  inputingThree() {
    if (this.blockTypeThree.length === 4) {
      this.blockFour.nativeElement.focus();
    }
  }

  inputingFour() {
    if (this.blockTypeFour.length === 4) {
      this.blockFive.nativeElement.focus();
    }
  }

  inputingFive() {
    if (this.blockTypeFive.length === 5) {
      this.blockSix.nativeElement.focus();
    }
  }

  inputingSix() {
    if (
      this.blockTypeSix.length === 3) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
  }

  // #endregion

  getOrdersToCard() {
    let id = localStorage.getItem('orderGroupId');

    this.service.httpGet(`${this.service.URL_API.ORDERS_TO_CART}/${id}`, null).subscribe(
      res => {
        this.orderCart = res.body['rows'];

        this.totalOrder = this.orderCart.reduce(function (a, b) {
          return a + b['total_price'];
        }, 0);
        console.log(this.totalOrder);

      },
      e => {
        console.log(e);
      }
    );

  }

  finishOrder() {
    this.load = true;

    let typeForm = null;
    this.formBoleto !== null ? typeForm = this.formBoleto : null; //string = 1 || 2 || 3 || 4
    this.debitCard !== false ? typeForm = 5 : null; //boolean = 5
    this.creditCard !== false ? typeForm = 6 : null; //boolean = 6

    console.log('tipo de pagamento', typeForm);

    let objSave = {
      order_group_id: this.groupId,
      user_id: this.userId,
      payment_total_value: this.totalOrder.toFixed(2),//valor total
      payment_installment_value: this.totalOrder.toFixed(2),//valor parcela
      installment_qtd: 0,//qtd parcela - valor setado no backend
      installment_nth: 0,//número da parcela - valor setado no backend
      date_create: moment().format('YYYY-MM-DD'),
      date_payment: moment().format('YYYY-MM-DD'),
      type: Number(typeForm),
      status_payment: 0,
      seller_id: localStorage.getItem("sellerID")
    }

    this.service.httpPost(this.service.URL_API.PAYMENT, objSave).subscribe(
      () => {
        let objupdate = {
          order_group_id: this.groupId,
          status: 1
        }
        this.service.httpPut(this.service.URL_API.ORDER_UPDATE_BY_GROUP, objupdate).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Pedido registrado com sucesso',
              text: 'redirecionando...',
              showConfirmButton: false,
            });
            localStorage.removeItem("orderGroupId");
            this.load = false;
            this.service.navigate(this.service.ROUTES.home, null);
            setTimeout(() => {
              location.reload();
            }, 1000);
          },
          e => {
            Swal.fire({
              icon: 'error',
              title: `Erro ao atualizar status do pedido... ${e.error.error}`,
              showConfirmButton: false,
            });
          }

        );
      },
      e => {
        Swal.fire({
          icon: 'error',
          title: `Erro ao salvar pagamento... ${e.error.error}`,
          showConfirmButton: false,
        });
        this.load = false;
      }
    );

    console.log(objSave);

  }

}
