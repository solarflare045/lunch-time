import { Cell } from '../cell';
import { Power } from './power';

import { NoScopePower } from './power-noscope';
import { LosePower } from './power-lose';
import { BaitPower } from './power-bait';
import { BombPower } from './power-bomb';
import { AttackPower } from './power-attack';

import { Observable } from 'rxjs';
import _ from 'lodash';

export class TerrifyPower extends Power {
  get color(): string  { return 'fuchsia'; }
  get icon(): string   { return 'eye-off'; }

  action(): Observable<any> {
    return Observable.timer(750)
      .map<Cell[]>(() =>
        _.chain(this.cell.game.board)
          .filter(cell => !(cell.power instanceof TerrifyPower || cell.power instanceof LosePower))
          .filter(cell => cell.revealed)
          .each(cell => cell.setPower(new TerrifyPower(cell)))
          .value()
      )
      .flatMap((cells) => _.isEmpty(cells) ? Observable.empty() : Observable.timer(750).mapTo(cells))
      .do((cells) => {
        _.each(cells, (cell: Cell) => {
          let Cls: any = _.sample([LosePower, BaitPower, BombPower, AttackPower, NoScopePower]);
          cell.hide();
          cell.setPower(new Cls(cell));
          cell.setMark(new TerrifyPower(cell));
        })
      });
  }
}