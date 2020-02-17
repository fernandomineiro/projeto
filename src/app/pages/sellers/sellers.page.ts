import { Component, OnInit } from '@angular/core';
import { UtilserviceService } from 'src/app/services/utilservice.service';
import { MenuController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.page.html',
  styleUrls: ['./sellers.page.scss'],
})
export class SellersPage implements OnInit {
  load = false;
  showBtnSave = false;
  states: any;
  cities: any;
  sellers: any;
  sellerId: number;
  idState: number = null;
  idCity: number = null;
  constructor(
    public service: UtilserviceService,
    public menuCtrl: MenuController,
    private nav: NavController,
  ) { }

  ngOnInit() {
    this.getStates();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  selectStateToSetCity() {
    this.getCities(this.idState);
    this.idCity = null;
    this.showBtnSave = false;
  }

  selectCityToUser() {
    this.getSeller(this.idCity);
    this.showBtnSave = false;
  }

  selectSeller(item: any) {
    this.sellers.map(
      row => {
        row.selector = false;
      }
    );
    item.selector = true;
    this.showBtnSave = true;
    this.sellerId = item.seller_id

  }

  getStates() {
    this.service.httpGet(this.service.URL_API.REGION_STATES, null).subscribe(
      res => {
        this.states = res.body;
      },
      e => {
        console.log(e);
      }
    );
  }

  getCities(id: number) {
    this.service.httpGet(`${this.service.URL_API.REGION_CITIES}/${id}`, null).subscribe(
      res => {
        this.cities = res.body;
      },
      e => {
        console.log(e);
      }
    );
  }

  getSeller(id: number) {
    this.service.httpGet(`${this.service.URL_API.REGION_SELLERS}/${id}`, null).subscribe(
      res => {
        this.sellers = res.body;
        this.sellers.map(
          row => {
            row.selector = false;
          }
        );
      },
      e => {
        console.log(e);
      }
    );
  }

  saveSeller() {
    this.load = true;
    let objUpdate = {
      id: localStorage.getItem('id'),
      seller_id: this.sellerId
    }
    this.service.httpPut(this.service.URL_API.UPDATE_USERS, objUpdate).subscribe(
      () => {
        localStorage.setItem('sellerID', this.sellerId.toString());
        setTimeout(() => {
          this.nav.navigateRoot('home');
        }, 1000)
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
        })

        Toast.fire({
          icon: 'success',
          title: 'Vendedor Vinculado!'
        })
      },
      e => {
        Swal.fire({
          icon: 'error',
          title: 'Verifique novamente!',
          text: e.error.Message
        });
      }
    );
  }

}
