import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { UtilserviceService } from '../../services/utilservice.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  load = false;
  loginForm: FormGroup;
  loadBtn: string = "block";

  constructor(
    public menuCtrl: MenuController,
    private nav: NavController,
    public alertCtrl: AlertController,
    public service: UtilserviceService,
    private formBuilder: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.onFormLogin();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  async presentAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Atenção',
      subHeader: 'Dados divergentes',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  onFormLogin() {
    this.loginForm = this.formBuilder.group({
      email: ["henriquemendes25@gmail.com", [Validators.required, Validators.email]],
      password: ["121513", [Validators.required, Validators.minLength(6)]]
    });
  }


  logar() {
    this.load = true;
    this.loadBtn = "";
    let objLogin = {
      email: this.loginForm.get("email").value,
      password: this.loginForm.get("password").value,

    }
    this.service.httpPost(this.service.URL_API.LOGIN, objLogin, false).subscribe(
      res => {
        console.log(res);
        if (res.body['error'] === true) {
          this.presentAlert(res.body['data']);
          this.load = false;
          this.loadBtn = "block";
        } else {
          localStorage.setItem("token", res.body['token']);
          localStorage.setItem("id", res.body['id']);
          localStorage.setItem("name", res.body['name']);
          localStorage.setItem("associate", res.body['associate']);
          localStorage.setItem("sellerID", res.body['seller_id']);

          this.service.token = res.body['token'];

          console.log(res.body);

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
            title: 'Logado com sucesso!'
          })
        }
      },
      err => {
        console.log(err);
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
          icon: 'error',
          title: err.error.message
        });
        this.load = false;
      }
    );
  }

  forgotPass() {
    this.service.navigate(this.service.ROUTES.password, null);
  }

  goRegister() {
    this.service.navigate(this.service.ROUTES.register, null);
  }

}
