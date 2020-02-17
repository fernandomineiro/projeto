import { Component, OnInit } from '@angular/core';
import { UtilserviceService } from 'src/app/services/utilservice.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  load = false;
  brandName: string;
  products: any;
  qtdSave: number;
  associate: any;
  constructor(
    private _goBack: Location,
    private ActivatedRoute: ActivatedRoute,
    public service: UtilserviceService
  ) {
    this.associate = localStorage.getItem('associate');
    console.log(this.associate);

  }

  ngOnInit() {
    this.ActivatedRoute.params.subscribe(params => {
      this.brandName = params.name
      this.getProducts(params.id);

    });
  }

  goBack() {
    this._goBack.back();
  }

  goCheckOut() {
    this.service.navigate(this.service.ROUTES.checkout, null);
  }

  addToCart(data: any) {
    data.product_qtd++;
    this.qtdSave = data.product_qtd;
  }

  lessToCart(data: any) {
    if (data.product_qtd > 1) {
      data.product_qtd--;
      this.qtdSave = data.product_qtd;
    }
  }

  getProducts(id: number) {

    this.service.httpGet(this.service.URL_API.PRODUCTS_BY_BRANDS, id).subscribe(
      res => {
        this.products = res.body;
      },
      e => {
        console.log(e);
      }
    );

  }

  orderToCart(obj: any, vlrs: number, vlrsP: any) {

    this.load = true;
    let orderGroup = localStorage.getItem("orderGroupId").toString();
    let objSave = {
      order_group_id: orderGroup,
      user_id: localStorage.getItem("id"),
      brand_id: obj.brand_id,
      category_id: obj.category_id,
      product_id: obj.product_id,
      seller_id: localStorage.getItem("sellerID"),
      qtd: obj.product_qtd,
      unit_price: obj.price.toFixed(2),
      total_price: vlrs.toFixed(2),
      associate_price: obj.associate_price.toFixed(2),
      datecreate: moment().format('YYYY-MM-DD'),
      status: 0,
    }
    console.log(objSave);

    this.service.httpPost(this.service.URL_API.ORDER_CREATE, objSave).subscribe(
      () => {
        this.load = false;
        const Toast = Swal.mixin({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });

        Toast.fire({
          icon: 'success',
          title: 'Pedido inserido no carrinho!'
        })
      },
      e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Erro: ${e.error.message}`,
        });
        this.load = false;
      }
    );

  }

}
