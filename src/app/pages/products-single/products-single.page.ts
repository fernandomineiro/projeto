import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MenuController } from '@ionic/angular';
import { UtilserviceService } from '../../services/utilservice.service';

@Component({
  selector: 'app-products-single',
  templateUrl: './products-single.page.html',
  styleUrls: ['./products-single.page.scss'],
})
export class ProductsSinglePage implements OnInit {
  load = false;
  idSingleProduct: number;
  singleProduct: any;
  constructor(
    private ActivatedRoute: ActivatedRoute,
    private _goBack: Location,
    public menuCtrl: MenuController,
    public service: UtilserviceService
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.ActivatedRoute.params.subscribe(params => {
      this.idSingleProduct = params.id;
      this.getSingleProduct(this.idSingleProduct);
    });
  }

  goBack() {
    this._goBack.back();
  }

  getSingleProduct(id) {
    this.load = true;
    this.service.httpGet(`${this.service.URL_API.SINGLE_PRODUCT}${id}`, null).subscribe(
      res => {
        this.load = false;
        this.singleProduct = res.body;
        console.log(this.singleProduct.product_name);
        console.log(this.singleProduct);
      },
      err => {
        console.log(err);
      }
    );
  }

}
