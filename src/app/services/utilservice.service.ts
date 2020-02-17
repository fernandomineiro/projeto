import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { URL_IMG, ENDPOINT, ROUTERS } from './endpoints'

@Injectable({
  providedIn: 'root'
})
export class UtilserviceService {
  token: string;
  URL_IMG = URL_IMG;
  URL_API = ENDPOINT;
  ROUTES = ROUTERS;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.token = localStorage.getItem("token");
    //GERA ID PEDIDO POR GRUPO
    let orderGroupId = new Date().getTime().toString();
    let order = localStorage.getItem("orderGroupId");
    if (order === null || order === "" || order === undefined) {
      localStorage.setItem("orderGroupId", orderGroupId);
      order = localStorage.getItem("orderGroupId");
    }
  }

  createAuthHeader(headers: HttpHeaders) {
    headers = headers.append("Authorization", `Bearer ${this.token}`);
    return headers;
  }

  httpPost(endpoint: string, param, requireToken = true) {
    let headers = new HttpHeaders();

    if (requireToken) {
      headers = this.createAuthHeader(headers);
    }

    return this.http.post(endpoint, param, {
      headers,
      observe: "response"
    });

  }

  httpPostUpload(endpoint: string, param) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(endpoint, param, {
      headers,
      observe: "response"
    });

  }

  httpPut(endpoint: string, param, requireToken = true) {
    let headers = new HttpHeaders();
    if (requireToken) {
      headers = this.createAuthHeader(headers);
    }
    return this.http.put(endpoint, param, { headers, observe: "response" });
  }

  httpGet(endpoint: string, param, requireToken = true) {
    let headers = new HttpHeaders();
    // headers = this.createAuthHeader(headers);
    if (requireToken) {
      headers = this.createAuthHeader(headers);
    }
    const routeParam = param ? endpoint + param : endpoint;
    return this.http.get(routeParam, { headers, observe: "response" });
  }

  httpDelete(endpoint: string, param) {
    let headers = new HttpHeaders();
    headers = this.createAuthHeader(headers);
    const routeParam = param ? endpoint + param : endpoint;
    return this.http.delete(routeParam, { headers, observe: "response" });
  }
  //navegação rotas
  navigate(route: string, param) {
    this.router.navigate([`/${route}`, param ? param : {}]);
  }

  formatCurrency(number) {
    // Default pt-BR
    if (!number) {
      return number;
    }
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

}
