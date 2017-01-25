import { Component } from '@angular/core';
import { AlertController,ItemSliding } from 'ionic-angular';
import _ from 'lodash';

import { PlayersProvider, Player } from '../../providers/players/players';

@Component({
  templateUrl: 'players.html',
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
    this.rename(this.playersProvider.add('New Player'), null);
  }

  delete(player: Player): void {
    let index = _.findIndex(this.players, player);
    this.playersProvider.delete(index);
  }

  rename(player: Player, slidingItem: ItemSliding): void {
    if (slidingItem)
      slidingItem.close();
          
    this.alertCtrl.create({
      title: 'Name',
      inputs: [
        {
          name: 'name',
          placeholder: player.name,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: (data) => {
            player.name = data.name || player.name;
            this.playersProvider.save();
          },
        },
      ],
    }).present();
  }

  score(player: Player, slidingItem: ItemSliding): void {
    if (slidingItem)
      slidingItem.close();

    this.alertCtrl.create({
      title: 'Score',
      inputs: [
        {
          name: 'score',
          placeholder: player.score.toString(),
          type: 'number',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: (data) => {
            player.score = +data.score || player.score;
          },
        },
      ],
    }).present();
  }

  reorderItems(indexes): void {
    this.playersProvider.swap(indexes.from, indexes.to);
  }

  reset(): void {
    this.players.forEach((player) => player.score = 0);
  }
}
