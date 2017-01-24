
import { Observable } from 'rxjs';
import { Power } from './power';
import _ from 'lodash';

import { LosePower } from './power-lose';

export class FirePower extends Power {
  get color(): string  { return 'Wheat'; }
  get icon(): string   { return 'bonfire'; }

  action(): Observable<any> {
    Observable.interval(2500)
      .takeWhile(() => this.cell.revealed && !this.cell.game.ended)
      .filter(() => !this.cell.game.busy)
      .do(() => {
        let cell = _.sample(
          _.chain(this.cell.game.board)
            .filter((_cell) => !_cell.revealed)
            .filter((_cell) => !(_cell.power instanceof LosePower || _cell.power instanceof BurnedPower))
            .value()
        );

        if (!cell)
          return;

        let power = new BurnedPower(cell);
        cell.setPower(power);
        cell.setMark(power);
      })
      .subscribe();

    return Observable.empty();
  }
}

export class BurnedPower extends Power {
  get color(): string { return null; }
  get disabled(): boolean { return true; }
  get icon(): string { return 'flame'; }

  action(): Observable<any> { return Observable.empty(); }
}
