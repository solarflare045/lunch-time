import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import _ from 'lodash';

import { Cell } from '../../providers/cell/cell';
import { GameProvider, Game } from '../../providers/game/game';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  game: Game;
  players: number = 0;

  constructor(private navCtrl: NavController, private gameProvider: GameProvider) {
    this.restart();
  }

  get board(): Cell[] {
    return this.game.board;
  }

  restart(): void {
    this.game = this.gameProvider.create(this.players);
    console.log(_.map(this.game.board, 'power'));
  }

  select(cell: Cell): void {
    this.game.select(cell);
  }
}
