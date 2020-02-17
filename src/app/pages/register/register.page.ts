
import { UtilserviceService } from '../../services/utilservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import Swal from 'sweetalert2';
import { MenuController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Location } from '@angular/common';
import * as moment from 'moment';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  formSend = false;
  id: string;
  registerForm: FormGroup;
  load: false;
  changeImg = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  loadBtn = false;


  constructor(
    private service: UtilserviceService,
    private formBuilder: FormBuilder,
    private nav: NavController,
    private modalService: BsModalService,
    private changeDetection: ChangeDetectorRef,
    public menuCtrl: MenuController,
    private _goBack: Location,
  ) { }


  ngOnInit() {
    this.createForm();
    this.id = localStorage.getItem('id');
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  goBack() {
    this._goBack.back();
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      name: [null, Validators.required],
      phone_number: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    });

  }

  fileChangeEvent(event: any, template: TemplateRef<any>): void {
    this.imageChangedEvent = event;
    this.changeImg = false;
    const _combine = combineLatest(
      this.modalService.onHide,
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());
    this.subscriptions.push(
      this.modalService.onHide.subscribe(() => {
        this.imageChangedEvent = "";
      })
    );
    this.subscriptions.push(_combine);
    this.modalRef = this.modalService.show(template);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  acceptImage() {
    this.changeImg = true;
    this.imageChangedEvent = "";
    console.log(this.imageChangedEvent);
    this.modalRef.hide();
  }

  resetCropp() {
    this.changeImg = false;
  }

  saveUser() {
    this.formSend = true;
    this.loadBtn = true;
    if (this.registerForm.invalid || this.changeImg === false) {
      Swal.fire({
        icon: 'error',
        title: 'Atenção!',
        text: 'Verifique os campos em destaques'
      });
      this.loadBtn = false;
      return;
    } else {
      //check pass
      let passOne = this.registerForm.get("password").value;
      let passTwo = this.registerForm.get("confirmPassword").value;
      if (passOne !== passTwo) {
        Swal.fire({
          icon: 'error',
          title: 'Atenção!',
          text: 'Verifique as senhas digitadas'
        });
        this.loadBtn = false;
        return;
      }

      var dataURL = this.croppedImage;
      var blob = this.service.dataURItoBlob(dataURL);
      var fd = new FormData(document.forms[0]);
      fd.append("filename", blob);

      this.service.httpPost(this.service.URL_API.USER_UPLOAD, fd, false).subscribe(
        res => {
          let imgNew = res.body['img'].replace('.blob', '.png');
          let objSave = {
            name: this.registerForm.get('name').value,
            phone_number: this.registerForm.get('phone_number').value,
            email: this.registerForm.get('email').value,
            password: this.registerForm.get('password').value,
            associate: 0,
            avatar: imgNew,
            status: 1,
            profile: 1,
            date_create: moment().format('YYYY-MM-DD'),
            last_access: moment().format('YYYY-MM-DD'),
            qty_of_purchases: 0
          }
          this.service.httpPost(this.service.URL_API.REGISTER_USERS, objSave).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Dados salvo com sucesso',
                text: 'direcionando...',
                showConfirmButton: false
              });
              this.formSend = false;
              let user = {
                email: this.registerForm.get('email').value,
                password: this.registerForm.get('password').value
              }
              this.service.httpPost(this.service.URL_API.LOGIN, user, false).subscribe(
                res => {
                  console.log(res);
                  if (res.body['error'] === true) {
                    this.load = false;
                    Swal.fire({
                      icon: 'error',
                      title: 'Falha no Login',
                      text: 'tente se logar novamente',
                      showConfirmButton: true
                    });

                  } else {
                    localStorage.setItem("token", res.body['token']);
                    localStorage.setItem("id", res.body['id']);
                    localStorage.setItem("name", res.body['name']);
                    this.service.token = res.body['token'];
                    setTimeout(() => {
                      this.nav.navigateRoot('sellers');
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
                    title: 'Falha no login'
                  })
                  this.load = false;
                }
              );
            },
            e => {
              Swal.fire({
                icon: 'error',
                title: 'Atenção!',

                text: `Erro no cadastro. ${e.error.message}`
              });
              console.log(e);
            }
          );

        },
        err => {
          console.log(err);
          this.loadBtn = false;
        }
      );

    }
  }

}
