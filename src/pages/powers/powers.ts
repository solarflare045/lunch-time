import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { CellConfigProvider, PowerOption } from '../../providers/cell/cell-config';

@Component({
  templateUrl: 'powers.html',
})
export class PowersPage {
  constructor(
    private alertCtrl: AlertController,
    private cellConfig: CellConfigProvider
  ) {

  }

  get powers(): PowerOption[] {
    return this.cellConfig.options;
  }

  modify(power: PowerOption): void {
    this.alertCtrl.create({
      title: power.name,
      subTitle: power.description,
      inputs: [
        {
          type: 'number',
          placeholder: 'Weight',
          name: 'weight',
          value: power.weight.toString(),
        },
      ],
      buttons: [
        {
          text: 'Disable',
          cssClass: 'danger',
          handler: () => {
            power.weight = 0;
          },
        },
        {
          text: 'Default',
          handler: () => {
            power.weight = undefined; // This resets the weight to its default setting.
          },
        },
        {
          text: 'OK',
          handler: (data) => {
            power.weight = +data.weight;
          },
        },
      ],
    }).present();
  }

  reset(): void {
    this.alertCtrl.create({
      title: 'Revert to defaults',
      message: 'Do you want to reset all power weightings to their defaults?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => this.cellConfig.resetConfig(),
        },
      ],
    }).present();
  }
}
