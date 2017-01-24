import { Power } from './power';
import { Observable } from 'rxjs';
import _ from 'lodash';

import { LosePower } from './power-lose';

export class AlarmPower extends Power {
  private _color: string = 'lightgrey';

  get color(): string { return this._color; }
  get icon(): string { return 'alarm'; }
  
  action(): Observable<any> {
    let detonated = Observable.timer(_.random(20000, 60000))
      .takeWhile(() => this.cell.revealed && !this.cell.game.ended)
      .do(() => this._color = 'red')
      .do(() => {
        _.chain(this.cell.game.board)
          .filter((cell) => !cell.revealed)
          .each((cell) => {
            let lose = new LosePower(cell);
            cell.setMark(lose);
            cell.setPower(lose);
          })
          .value();
      });

    Observable.interval(500)
      .takeWhile(() => this.cell.revealed && !this.cell.game.ended)
      .takeUntil(detonated)
      .do((i) => {
        this._color = (i % 2)
          ? 'lightgrey'
          : 'yellow';
      })
      .subscribe();

    return Observable.empty();
  }
}