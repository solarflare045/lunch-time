import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NavController, LoadingController } from 'ionic-angular';
import _ from 'lodash';
import { Storage } from '@ionic/storage';

import { Cell } from '../../providers/cell/cell';
import { GameProvider, Game } from '../../providers/game/game';
import { QuantumProvider } from '../../providers/quantum/quantum';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  game: Game;
  players: number = 0;
  isQuantum: boolean = true;

  constructor(
    private navCtrl: NavController,
    private gameProvider: GameProvider,
    private loadingCtrl: LoadingController,
    private quantumProvider: QuantumProvider,
    private storage: Storage) {
    this.shuffle();
    this.storage.get('isQuantum').then((isQuantum) => {
      if (isQuantum != null) {
        this.isQuantum = isQuantum;
      }
    })
  }

  get board(): Cell[] {
    return this.game.board;
  }

  restart(): void {
    if (this.isQuantum) {
      this.reseed().subscribe({
        complete: () => this.shuffle()
      })
    } else {
      this.shuffle();
    }
  }

  private shuffle(): void {
    this.game = this.gameProvider.create(this.players);
    console.log(_.map(this.game.board, 'power'));
  }

  select(cell: Cell): void {
    this.game.select(cell);
  }

  reseed(): Observable<string> {
    let loading = this.loadingCtrl.create({
      content: 'Splitting universe...'
    });
    loading.present();
    return this.quantumProvider.getQuantum().single().do({
      next: (seed) => {
        this.gameProvider.reseed(seed);
        loading.setContent('YAY!');
        loading.dismiss();
      },
      error: () => {
        loading.setContent('Didn\'t work');
        setTimeout(() => loading.dismiss(), 500);
      }
    })
    
  }
  saveQuantum(isQuantum: boolean): void {
    this.storage.set('isQuantum', isQuantum);
  }
}
