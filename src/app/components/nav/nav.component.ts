import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators'
import { StoreService } from '../../services/store.service'
import { AuthService } from '../../services/auth.service'
import { User } from '../../models/user.model'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  activeMenu = false;
  counter = 0;
  //token = '';
  profile: User | null = null;

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length;
    });
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  login(){
    ///Implementación Propia
    //this.authService.login('sebas@mail.com', '1212')
    //.pipe(
    //  switchMap((rta) => this.getProfileTk(rta.access_token),
    //  ),
    //)
    //.subscribe(profile => {
    //  console.log(profile);
    //  this.profile = profile;
    //});

    ///Implementación de Instructor
    this.authService.loginAndGet('sebas@mail.com', '1212')
    .subscribe(user => {
      this.profile = user;
      //this.token = '---'
    })
  }

  //getProfile(){
  //  this.authService.profile(this.token)
  //  .subscribe(profile => {
  //    console.log(profile);
  //    this.profile = profile;
  //  });
  //}

  ///Desuso por implementar lógica de token.service
  //getProfileTk(token: string){
  //  this.token = token;
  //  return this.authService.getProfile(this.token);
  //}

}
