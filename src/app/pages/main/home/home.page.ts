import { Component, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { Card } from 'src/app/models/card.interface';
import { SelectMenu } from 'src/app/models/select-menu.interface';
import { User } from 'src/app/models/user.interface';

import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private utils = inject(UtilsService);

  public cards: Card[] = [];
  public totalCards: number = 9;
  public numArray: number[];
  public numCard: number = 0;
  public canTriggerActivate: boolean = false;
  public showCards: boolean = false;

  public user!: User;
  public selectMenu: SelectMenu[] = [
    { value: 'bajo', label: 'Bajo' },
    { value: 'medio', label: 'Medio' },
    { value: 'alto', label: 'Alto' },
  ];
  public timeDifficulty: number = 5000;
  public timeCounter = signal<number>(5);

  constructor() {
    this.numArray = [...Array(this.totalCards).keys()].map(num => num + 1); // Array de números del 1 al 9

    this.utils.getUser
      .pipe(
        takeUntilDestroyed()
      )
      .subscribe( user => {
        this.user = user;
        switch (this.user.dificultad) {
          case 'bajo': this.timeDifficulty = 10000; break;
          case 'medio': this.timeDifficulty = 5000; break;
          case 'alto': this.timeDifficulty = 2000; break;
        }
      });
  }

  ngOnInit() {
  }

  signOut() {
    this.utils.removeFromLocalStorege('user');
    this.utils.routerLink('/auth');
  }

  activate(card: Card) {

    if (!this.canTriggerActivate) return;

    this.canTriggerActivate = false;
    card.active = true;

    // Si gana
    if (card.value === this.numCard) {
      switch (this.user.dificultad) {
        case 'bajo': this.user.puntos += 10; break;
        case 'medio': this.user.puntos += 20; break;
        case 'alto': this.user.puntos += 30; break;
      }
      this.user.max = (this.user.max > this.user.puntos) ? this.user.max : this.user.puntos;
      this.utils.setUser = this.user;
      card.success = true;
      setTimeout(() => {
        this.iniGame();
      }, 1000);
    }
    // Si pierde
    else {
      this.user.puntos = 0;
      this.utils.setUser = this.user;
      this.utils.vibrate({ duration: 300 });
      card.fail = true;
      setTimeout(() => {
        this.cards = [];
      }, 1500);
    }
  }

  iniGame() {

    this.numCard = this.generarNumeroAleatorio( [...this.numArray] ) + 1

    const arregloAleatorio: number[] = this.generarArregloAleatorio();
    this.iniCardsArray(arregloAleatorio);

    this.showCards = true;
    this.iniContador(this.timeDifficulty);
    setTimeout(() => {
      this.showCards = false;
      this.canTriggerActivate = true;
      this.flipCard(false);
    }, this.timeDifficulty);

  }

  iniCardsArray(arregloAleatorio: number []) {
    this.cards = [];
    for (let i = 0; i < arregloAleatorio.length; i++) {
      const card: Card = { value: arregloAleatorio[i], active: true, success: false, fail: false };
      this.cards.push(card);
    }
  }

  generarNumeroAleatorio( numeros: number[] ): number {
    return Math.floor(Math.random() * numeros.length);
  }

  generarArregloAleatorio(): number[] {
    const numeros: number[] = [...this.numArray];
    const arregloAleatorio: number[] = [];

    while (numeros.length > 0) {
      const indiceAleatorio: number = this.generarNumeroAleatorio( numeros );
      const numeroAleatorio: number = numeros.splice(indiceAleatorio, 1)[0];
      arregloAleatorio.push(numeroAleatorio);
    }
    return arregloAleatorio;
  }

  flipCard( flip: boolean ) {
    this.cards.map( card => card.active = flip );
  }

  iniContador(segundos: number) {
    let tiempoRestante = segundos / 1000;
    this.timeCounter.set(tiempoRestante);

    const intervalo = setInterval(() => {
      tiempoRestante--;
      this.timeCounter.set(tiempoRestante);

      if (tiempoRestante >= 0) {
      } else {
        clearInterval(intervalo); // Detiene el intervalo cuando se agota el tiempo
      }
    }, 1000); // Actualiza cada segundo
  }

}
