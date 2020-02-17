
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UtilserviceService } from '../services/utilservice.service';



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public service: UtilserviceService) { }
  canActivate(): boolean {
    console.log(this.service.token);

    if (this.service.token) {
      return true;
    } else {
      this.service.navigate(this.service.ROUTES.login, null);
      return false;
    }
  }
}
