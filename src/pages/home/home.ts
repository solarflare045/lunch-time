import { Component, animate, state, style, transition, trigger } from '@angular/core';
import { Observable } from 'rxjs';
import { NavController, LoadingController, PopoverController } from 'ionic-angular';
import _ from 'lodash';
import { Storage } from '@ionic/storage';

import { HomeOptionsPage } from './home-options';
import { GamePage } from '../game/game';
import { PlayersPage } from '../players/players';
import { PowersPage } from '../powers/powers';
import { Cell } from '../../providers/cell/cell';
import { GameProvider, Game, GamePlayer } from '../../providers/game/game';
import { GameModeFactory, IMessage } from '../../providers/game/modes/';
import { OrientationProvider } from '../../providers/orientation/orientation';
import { QuantumProvider } from '../../providers/quantum/quantum';
import { PlayersProvider } from '../../providers/players/players';

interface OrderedPlayer extends GamePlayer {
  leading: boolean;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

  animations: [
    trigger('spinInOut', [
      state('void', style({
        opacity: 0.0,
        transform: 'rotate(270deg) scale(0)',
      })),

      transition('void <=> *', animate('350ms ease-out')),
    ]),

    trigger('overlay', [
      state('void', style({
        opacity: 0.0,
        transform: 'translate(-50%, -40%)',
      })),

      state('in', style({
        opacity: 0.9,
        transform: 'translate(-50%, -50%)',
      })),

      transition('void <=> *', animate('500ms linear')),
    ]),

    trigger('square', [
      state('void', style({
        opacity: 0.0,
        transform: 'scale(0)',
      })),

      state('revealed', style({
        transform: 'scale(0.9)',
      })),
      state('hidden', style({
        transform: 'scale(1)',
      })),
      state('disabled', style({
        opacity: 0.6,
      })),

      transition('void => *', animate('350ms ease-out')),
      transition('revealed <=> hidden, hidden <=> disabled, disabled <=> revealed', animate('300ms ease-out')),
    ]),

    trigger('gameStateChip', [
      state('void',       style({ opacity: 0.0 })),

      state('restaurant', style({ 'background-color': 'red'             })),
      state('time',       style({ 'background-color': 'gold'            })),
      state('checkmark',  style({ 'background-color': 'mediumseagreen', opacity: 0.0  })),
      state('happy',      style({ 'background-color': 'gold'            })),

      transition('* <=> *', animate('250ms linear')),
    ]),
  ],
})
export class HomePage {
  game: Game;
  message$: Observable<IMessage>;
  isQuantum: boolean = true;
  title: Observable<string>;

  constructor(
    private navCtrl: NavController,
    private gameProvider: GameProvider,
    private loadingCtrl: LoadingController,
    private quantumProvider: QuantumProvider,
    private storage: Storage,
    private popoverCtrl: PopoverController,
    private playersProvider: PlayersProvider,
    private orientationProvider: OrientationProvider,
    private gameModeFactory: GameModeFactory,
  ) {
    this.shuffle();
    this.gameModeFactory.load()
      .then(() => this.playersProvider.load())
      .then(() => this.shuffle());

    this.storage.get('isQuantum').then((isQuantum) => {
      if (isQuantum != null) {
        this.isQuantum = isQuantum;
      }
    });

    this.message$ = this.gameModeFactory.messages
      .concatMap((message) =>
        Observable.concat(
          Observable.of(message),
          <Observable<any>>Observable.timer(3000).ignoreElements(),
          Observable.of(null),
          <Observable<any>>Observable.timer(500).ignoreElements(),
        )
      );

    // Include this subscription on the view. As long as it is subscribed to, the screen orientation is locked to portrait.
    this.title = this.orientationProvider.lock.startWith('Lunch Time');
  }

  presentOptions(myEvent) {
    this.popoverCtrl.create(HomeOptionsPage, this)
      .present({ ev: myEvent });
  }

  changeGame() {
    this.navCtrl.push(GamePage);
  }

  changePlayers() {
    this.navCtrl.push(PlayersPage);
  }

  changePowers() {
    this.navCtrl.push(PowersPage);
  }

  get gameState(): string {
    if (this.game.ended)
      return 'restaurant';

    else if (this.game.busy)
      return 'time';

    else if (this.game.currentPlayer.crazy)
      return 'happy';

    return 'checkmark';
  }

  get board(): Cell[] {
    return this.game.board;
  }

  get playerCount(): number {
    return this.players.length;
  }

  get players(): GamePlayer[] {
    return this.game.players;
  }

  get orderedPlayers(): OrderedPlayer[] {
    return _.chain(this.players)
      .orderBy<GamePlayer>([ 'score', 'name' ], [ 'desc', 'asc' ])
      .map((player, i, arr) =>
        _.extend(player, {
          leading: player.score > 0 && player.score === arr[0].score,
        })
      )
      .value();
  }

  get currentPlayer(): GamePlayer {
    return this.players[this.game.turn];
  }

  get playersAreSetUp(): boolean {
    return this.playersProvider.count > 0;
  }

  get modeName(): string {
    return this.game.mode.name;
  }

  restart(): void {
    if (this.isQuantum) {
      this.reseed().subscribe({
        complete: () => this.shuffle(),
      });
    } else {
      this.shuffle();
    }
  }

  private shuffle(): void {
    this.game = this.gameProvider.create(this.playersProvider.players, this.gameModeFactory.mode);
    console.log(_.map(this.game.board, 'power'));
  }

  select(cell: Cell): void {
    if (this.game.currentPlayer.crazy)
      return;

    this.game.select(cell);
  }

  reseed(): Observable<string> {
    let loading = this.loadingCtrl.create({
      content: 'Splitting Universe...',
    });
    loading.present();
    return this.quantumProvider.getQuantum()
      .timeout(2000)
      .single()
      .do({
        next: (seed) => {
          this.gameProvider.reseed(seed);
          loading.setContent('Meow!');
          loading.dismiss();
        },
        error: () => {
          loading.setContent('Quantum Random Unavailable');
          setTimeout(() => loading.dismiss(), 500);
        },
      })
      .catch(() => Observable.empty<string>());
  }
  
  saveQuantum(isQuantum: boolean): void {
    this.storage.set('isQuantum', isQuantum);
  }
}
