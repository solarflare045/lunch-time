import { Cell } from '../cell';
import { Power } from './power';

import { AlarmPower } from './power-alarm';
import { AttackPower } from './power-attack';
import { BaitPower } from './power-bait';
import { BombPower } from './power-bomb';
import { LosePower } from './power-lose';
import { NoScopePower } from './power-noscope';

import { Observable } from 'rxjs';
import _ from 'lodash';

export class TerrifyPower extends Power {
  get color(): string  { return 'fuchsia'; }
  get icon(): string   { return 'eye-off'; }

  action(): Observable<any> {
    return Observable.timer(750)
      .map<Cell[]>(() =>
        _.chain(this.cell.game.board)
          .filter((cell) => !(cell.power instanceof TerrifyPower || cell.power instanceof LosePower || cell.power instanceof AlarmPower))
          .filter((cell) => cell.revealed)
          .each((cell) => cell.setPower(new TerrifyPower(cell)))
          .value()
      )
      .flatMap((cells) => _.isEmpty(cells) ? Observable.empty() : Observable.timer(750).mapTo(cells))
      .do((cells) => {
        _.each(cells, (cell: Cell) => {
          let cls: any = _.sample([ LosePower, BaitPower, BombPower, AttackPower, NoScopePower ]);
          cell.hide();
          cell.setPower(new cls(cell));
          cell.setMark(new TerrifyPower(cell));
        });
      });
  }
}
