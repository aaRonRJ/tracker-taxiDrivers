import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';

import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController,
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public usuarioProvider: UsuarioProvider) {}

  ionViewDidLoad() {
    this.slides.paginationType = 'progress';
    
    // Estas 2 líneas sirven para que el usuario no pueda moverse entre las slides.
    this.slides.lockSwipes(true);
    this.slides.freeMode = false;
  }
  
  mostrarInput() {
    this.alertCtrl.create({
      title: 'Ingresar usuario',
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ingresar',
          handler: data => {
            console.log('Usuario:', data.username);
            this.verifyUser(data.username);
          }
        }
      ]
    }).present();
  }

  verifyUser(keyUser: string) {
    let loading = this.loadingCtrl.create({
      content: 'Verificando'
    });

    loading.present();
    
    this.usuarioProvider.verifyUser(keyUser)
    .then(exist => {
      loading.dismiss();
      
      if (exist) {
        // Se desbloquea el slides y se pasa al siguiente slide y de nuevo se vuelve a bloquear.
        this.lockandunlockSlides(false);
        this.slides.slideNext();
        this.lockandunlockSlides(true);
      } else {
        this.alertCtrl.create({
          title: 'Usuario incorrecto',
          subTitle: 'Hable con el administrador o pruebe de nuevo',
          buttons: ['Aceptar']
        }).present();
      }
    });
  }

  lockandunlockSlides(block: boolean) {
    this.slides.lockSwipes(block);
    this.slides.freeMode = block ? false : true;
  }

  ingresar() {
    this.navCtrl.setRoot(HomePage);
  }
}
