import { UsuarioProvider } from './../usuario/usuario';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class UbicacionProvider {
  taxiDriver: AngularFirestoreDocument<any>;
  private watchGeolocation: Subscription;

  constructor(private geolocation: Geolocation,
              public usuarioProvider: UsuarioProvider,
              private afDB: AngularFirestore) {
    
  }

  initTaxiDriver() {
    this.taxiDriver = this.afDB.doc(`/usuarios/${this.usuarioProvider.keyUser}`);
  }
  
  initGeolocation() {
    this.geolocation.getCurrentPosition()
    .then((resp) => {
      this.taxiDriver.update({
        lat: resp.coords.latitude,
        lng: resp.coords.longitude,
        clave: this.usuarioProvider.keyUser
      });
      
      /* Está observando la localización del dispositivo y cada vez que se va moviendo,
      va devolviendo las coordenadas de donde está el dispositivo. */
      this.watchGeolocation = this.geolocation.watchPosition()
      .subscribe((data) => {
        this.taxiDriver.update({
          lat: data.coords.latitude,
          lng: data.coords.longitude,
          clave: this.usuarioProvider.keyUser
        });
      });
     })
     .catch((error) => {
       console.log('Error getting location', error);
     });
  }

  stopGeolocation() {
    try {
      this.watchGeolocation.unsubscribe();
    } catch(e) {
      console.log(JSON.stringify(e));
    }
  }
}
