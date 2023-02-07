import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  saveToken(token: string){
    //localStorage;
    localStorage.setItem('token', token);
    //seesionStore
    //sessionStorage.setItem('token', token);
  }

  getToken(){
    //localStorage
    const token = localStorage.getItem('token');
    //sessionStorage
    //const token = sessionStorage.getItem('token');
    return token;
  }
}
