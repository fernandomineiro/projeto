import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UtilserviceService } from '../../services/utilservice.service';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  productsBestSellers: any;
  productsSeller: any;
  brands: any;
  banners: any;
  news: any;
  loadOne = false;
  loadTwo = false;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoplay: true
  };
  constructor(
    public menuCtrl: MenuController,
    public service: UtilserviceService
  ) { }

  ngOnInit() {
    this.listBanners();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  goBrand(id: number, name: string) {
    this.service.navigate(this.service.ROUTES.products, {
      id,
      name
    })
    console.log(id);
  }

  listBanners() {
    this.service.httpGet(this.service.URL_API.BANNERS_ACTIVE, null).subscribe(
      res => {
        this.banners = res.body;
        console.log(this.banners);

        this.listBrands();
      },
      e => {
        console.log(e);
      }
    )
  }

  listBrands() {
    this.service.httpGet(this.service.URL_API.BRANDS, null).subscribe(
      res => {
        this.brands = res.body;
        this.listNews();
      },
      e => {
        console.log(e);
      }
    );
  }

  listNews() {
    this.service.httpGet(this.service.URL_API.NEWS_ACTIVE, null).subscribe(
      res => {
        this.news = res.body;
        console.log(this.news);
      },
      e => {
        console.log(e);
      }
    )
  }

}
