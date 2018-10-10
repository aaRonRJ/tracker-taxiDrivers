import { LoginPage } from './../login/login';
import { UbicacionProvider } from './../../providers/ubicacion/ubicacion';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: any = {};

  constructor(public navCtrl: NavController,
              private ubicacionProvider: UbicacionProvider,
              private usuarioProvider: UsuarioProvider) {
    ubicacionProvider.initGeolocation();
    ubicacionProvider.initTaxiDriver();

    ubicacionProvider.taxiDriver.valueChanges()
    .subscribe(data => this.user = data);
  }

  logout() {
    this.ubicacionProvider.stopGeolocation();
    this.usuarioProvider.clearUser();

    this.navCtrl.setRoot(LoginPage);
  }
}
