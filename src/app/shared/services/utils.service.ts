import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';
import { Haptics, ImpactStyle, VibrateOptions } from '@capacitor/haptics';
import { User } from 'src/app/models/user.interface';
import { valueMenu } from 'src/app/models/select-menu.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);
  private router = inject(Router);

  private resetUser: User = { name: '', dificultad: 'medio', puntos: 0, max: 0 };
  private user$: BehaviorSubject<User> = new BehaviorSubject<User>({
    name: '',
    dificultad: 'medio',
    puntos: 0,
    max: 0
  });

  constructor() {
    this.loadFromLocalStorege('user');
  }

  public loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  public async toast(opts: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  public async vibrate( duration: VibrateOptions) {
    console.log('vibrar')
    await Haptics.vibrate(duration);
  }

  public routerLink( url: string ) {
    return this.router.navigateByUrl(url);
  }

  public saveInLocalStorege( key: string, value: User ) {
    return localStorage.setItem( key, JSON.stringify(value) );
  }

  public loadFromLocalStorege( key: string ) {
    if ( !localStorage.getItem( key ) ) {
      const user: User = { name: '', dificultad: 'bajo', puntos: 0, max: 0 };
      this.user$.next( user );
    } else {
      this.user$.next(JSON.parse( localStorage.getItem( key )! ));
    }
  }

  public removeFromLocalStorege( key: string ) {
    localStorage.removeItem(key);
    this.user$.next(this.resetUser);
  }

  public get getUser(): Observable<User> {
    return this.user$.asObservable();
  }

  public get getUserValue(): User {
    return this.user$.getValue();
  }

  public set setUser(user : User) {
    this.user$.next(user);
    this.saveInLocalStorege( 'user', user );
  }

  public get getDifficulty(): valueMenu {
    return this.user$.getValue().dificultad;
  }

  public set setDifficulty(dificultad: valueMenu) {
    let user: User = this.getUserValue;
    user.dificultad = dificultad;
    this.user$.next(user);
    this.saveInLocalStorege( 'user', user );
  }



}
