import { Power } from './power';
import { Observable } from 'rxjs';
import _ from 'lodash';

import { SafePower } from './power-safe';

export class WifiPower extends Power {
  get color(): string  { return 'aquamarine'; }
  get icon(): string   { return 'wifi'; }

  get animation(): string {
    return this.cell.revealing
      ? 'flashing'
      : null;
  }

  action(): Observable<any> {
    return Observable.defer(() => {
      _.chain(this.cell.getLinear())
        .filter((cell) => cell.power instanceof SafePower)
        .each((cell) => cell.setMark(cell.power))
        .value();

      return Observable.timer(1000);
    });
  }
}
