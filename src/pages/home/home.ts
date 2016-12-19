import { Component, animate, state, style, transition, trigger } from '@angular/core';
import { Observable } from 'rxjs';
import { NavController, LoadingController, PopoverController } from 'ionic-angular';
import _ from 'lodash';
import { Storage } from '@ionic/storage';

import { HomeOptionsPage } from './home-options';
import { PlayersPage } from '../players/players';
import { Cell } from '../../providers/cell/cell';
import { GameProvider, Game } from '../../providers/game/game';
import { QuantumProvider } from '../../providers/quantum/quantum';
import { PlayersProvider, Player } from '../../providers/players/players';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

  animations: [
    trigger('spinInOut', [
      state('void', style({
        opacity: 0.0,
        transform: 'rotate(270deg) scale(0)'
      })),

      transition('void <=> *', animate('350ms ease-out'))
    ]),

    trigger('square', [
      state('void', style({
        opacity: 0.0,
        transform: 'scale(0)'
      })),

      state('revealed', style({
        transform: 'scale(0.9)'
      })),
      state('hidden', style({
        transform: 'scale(1)'
      })),
      state('disabled', style({
        opacity: 0.6
      })),

      transition('void => *', animate('350ms ease-out')),
      transition('revealed <=> hidden, hidden <=> disabled, disabled <=> revealed', animate('300ms ease-out')),
    ])
  ]
})
export class HomePage {
  game: Game;
  isQuantum: boolean = true;

  constructor(
    private navCtrl: NavController,
    private gameProvider: GameProvider,
    private loadingCtrl: LoadingController,
    private quantumProvider: QuantumProvider,
    private storage: Storage,
    private popoverCtrl: PopoverController,
    private playersProvider: PlayersProvider
  ) {
    this.shuffle();
    this.storage.get('isQuantum').then((isQuantum) => {
      if (isQuantum != null) {
        this.isQuantum = isQuantum;
      }
    })
  }

  presentOptions(myEvent) {
    this.popoverCtrl.create(HomeOptionsPage, this)
      .present({ ev: myEvent });
  }

  changePlayers() {
    this.navCtrl.push(PlayersPage);
  }

  get board(): Cell[] {
    return this.game.board;
  }

  get playerCount(): number {
    return this.players.length;
  }

  get players(): Player[] {
    return this.game.players;
  }

  get currentPlayer(): Player {
    return this.players[this.game.turn];
  }

  get playersAreSetUp(): boolean {
    return this.playersProvider.count > 0;
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
    this.game = this.gameProvider.create(_.clone(this.playersProvider.players)); // Shallow clone only!
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
