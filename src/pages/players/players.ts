import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import _ from 'lodash';

import { PlayersProvider, Player } from '../../providers/players/players';

@Component({
  templateUrl: 'players.html'
})
export class PlayersPage {
  players: Player[];

  constructor(
    private playersProvider: PlayersProvider,
    private alertCtrl: AlertController
  ) {
    this.players = this.playersProvider.players;
  }

  create(): void {
    this.rename(this.playersProvider.add('New Player'));
  }

  delete(player: Player): void {
    let index = _.findIndex(this.players, player);
    this.playersProvider.delete(index);
  }

  rename(player: Player): void {
    this.alertCtrl.create({
      title: 'Name',
      inputs: [
        {
          name: 'name',
          placeholder: player.name
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data) => {
            player.name = data.name || player.name;
          }
        }
      ]
    }).present();
  }

  reorderItems(indexes): void {
    this.playersProvider.swap(indexes.from, indexes.to);
  }

  reset(): void {
    this.players.forEach(player => player.score = 0);
  }
}