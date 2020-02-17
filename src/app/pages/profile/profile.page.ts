import { ENDPOINT } from '../../services/endpoints';
import { UtilserviceService } from '../../services/utilservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  usuario: any;
  formSend = false;
  id: string;
  registerForm: FormGroup;
  submitted = false;
  changeImg = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  loadBtn = false;


  constructor(
    public service: UtilserviceService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private changeDetection: ChangeDetectorRef,
    private camera: Camera,
  ) { }


  ngOnInit() {
    this.createForm();
    this.id = localStorage.getItem('id');
    this.getUser(this.id);
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [null],
      confirmPassword: [null]
    });



  }

  getUser(id) {
    this.service.httpGet(`${ENDPOINT.GET_USER}/${id}`, null)
      .subscribe(response => {
        this.usuario = response.body;
        this.registerForm.get('name').setValue(this.usuario.name);
        this.registerForm.get('phone_number').setValue(this.usuario.phone_number);
        this.registerForm.get('email').setValue(this.usuario.email);
        this.registerForm.get('email').disable();


      },
        error => {
          console.log(error);
        }

      );

  }

  saveUser() {
    this.formSend = true;
    if (this.registerForm.invalid) {
      Swal.fire({
        icon: 'info',
        title: 'Atenção!',
        text: 'Verifique os campos em destaques'
      });
    } else {
      let objSave = {
        id: this.usuario.id,
        name: this.registerForm.get('name').value,
        phone_number: this.registerForm.get('phone_number').value,
      }
      this.service.httpPut(ENDPOINT.UPDATE_USERS, objSave).subscribe(
        res => {
          Swal.fire({
            icon: 'success',
            text: 'Dados salvo com sucesso'
          });
        },
        e => {
          Swal.fire({
            icon: 'error',
            title: 'Atenção!',
            text: e.error.message
          });
        }
      );
    }
  }  

  saveImage() {
    this.loadBtn = true;
    var dataURL = this.urlImg;
    var blob = this.service.dataURItoBlob(dataURL);
    var fd = new FormData(document.forms[0]);
    fd.append("filename", blob);

    this.service.httpPost(this.service.URL_API.USER_UPLOAD, fd).subscribe(
      res => {
        let imgNew = res.body['img'].replace('.blob', '.png');
        let objUpdate = {
          id: this.id,
          avatar: imgNew

        }
        this.service.httpPut(this.service.URL_API.UPDATE_USERS, objUpdate).subscribe(
          () => {
            this.loadBtn = false;
            this.modalRef.hide();
            this.getUser(this.id)
          },
          e => {
            this.loadBtn = false;
            this.modalRef.hide();
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

  // 
  // 
  // 
  urlImg: string;
  options: CameraOptions = {
    quality: 30,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  captureImage(template: TemplateRef<any>) {
    this.changeImg = true;
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

    this.camera.getPicture(this.options).then((imageData) => {

      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.urlImg = base64Image;


      // let orderGroupId = new Date().getTime().toString(); 

    }, (err) => {
      console.log(err);
      // Handle error
    });
  }

}
