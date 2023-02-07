import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "./../../environments/environment";
import { Auth } from './../models/auth.model';
import { User } from './../models/user.model';
import { TokenService } from './../services/token.service';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.API_URL}/api/auth`;
  //'https://young-sands-07814.herokuapp.com/api/products';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(email: string, password: string){
    return this.http.post<Auth>(`${this.apiUrl}/login`,{email, password})
    .pipe(
      tap(response => this.tokenService.saveToken(response.access_token))
    );
  }

  getProfile(){
    //const headers = new HttpHeaders();
    //headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/profile`, {
      //Usando constantes
      //headers
      //Forma manual de definir los headers
/*        headers: {
        Authorization: `Bearer ${token}`,
        //'Content-type' : 'applicatio/json'
      } */
    });
  }

  loginAndGet(email: string, password: string){
    return this.login(email, password)
    .pipe(
      //switchMap(rta => this.getProfile(rta.access_token)),
      switchMap(() => this.getProfile()),
    )
  }
}
