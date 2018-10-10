import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class UsuarioProvider {
  keyUser: string;
  user: any = {};
  private doc: Subscription;

  constructor(private afDB: AngularFirestore,
              private platform: Platform,
              private storage: Storage) {}
  
  verifyUser(keyUser: string) {
    keyUser = keyUser.toLocaleLowerCase();

    return new Promise((resolve, reject) => {
      this.doc = this.afDB.doc(`/usuarios/${keyUser}`)
      .valueChanges().subscribe(data => {
        if (data) {
          this.keyUser = keyUser;
          this.user = data;
          this.saveInStorage();

          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  saveInStorage() {
    if (!this.platform.is('cordova')) {
      localStorage.setItem('keyUser', this.keyUser);
    } else {
      this.storage.set('keyUser', this.keyUser);
    }
  }

  getStorage() {
    return new Promise((resolve, reject) => {
      if (!this.platform.is('cordova')) {
        if (localStorage.getItem('keyUser')) {
          this.keyUser = localStorage.getItem('keyUser');
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        this.storage.get('keyUser').then((val) => {
          if (val) {
            this.keyUser = val;
            resolve(true);
          } else {
            resolve(false);
          }          
        });
      }
    });
  }

  clearUser() {
    this.keyUser = null;

    if (this.platform.is('cordova')) {
      this.storage.remove('keyUser');
    } else {
      localStorage.removeItem('keyUser');
    }

    this.doc.unsubscribe();
  }
}
