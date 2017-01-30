import { Power } from './power';
import { Cell } from '../cell';

import { LosePower } from './power-lose';

import { Observable } from 'rxjs';
import _ from 'lodash';

export class FlaskPower extends Power {
  get color(): string { return 'YellowGreen'; }
  get icon(): string { return 'flask'; }

  get animation(): string {
    return this.cell.revealing
      ? 'flashing'
      : null;
  }

  action(): Observable<any> {
    return Observable.timer(1250)
      .do(() => {
        let chance = _.random(2, 8) * 10;
        let power = new FlaskRerollPower(this.cell, chance);
        this.cell.hide();
        this.cell.setPower(power);
        this.cell.setMark(this);
      });
  }
}

export class FlaskRerollPower extends FlaskPower {
  constructor(cell: Cell, private chance: number) {
    super(cell);
  }

  get text(): string {
    return this.cell.revealed
      ? ''
      : `${ this.chance }%`;
  }

  action(): Observable<any> {
    return Observable.defer(() => {
      if (_.random(0, 100) > this.chance)
        return super.action();

      this.cell.setPower(new LosePower(this.cell));
      return this.cell.power.action();
    });
  }
}
