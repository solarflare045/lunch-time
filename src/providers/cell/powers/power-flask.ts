import { Power } from './power';
import { PowerType } from '../cell-config';

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
        let cls: PowerType = _.sample([ FlaskLosePower, FlaskRerollPower ]);
        let power = new cls(this.cell);
        this.cell.hide();
        this.cell.setPower(power);
        this.cell.setMark(this);
      });
  }
}

export class FlaskRerollPower extends FlaskPower {

}

export class FlaskLosePower extends LosePower {

}
