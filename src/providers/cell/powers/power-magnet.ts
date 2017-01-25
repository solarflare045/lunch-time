import { Cell } from '../cell';
import { Power } from './power';
import { Observable } from 'rxjs';
import _ from 'lodash';

export class MagnetPower extends Power {
  get color(): string  { return 'wheat'; }
  get icon(): string   { return 'magnet'; }

  get animation(): string {
    return this.attracting
      ? 'attracting'
      : null;
  }

  action(): Observable<any> {
    return Observable.timer(10);
  }

  get attracting(): boolean {
    return this.active && !this.cell.revealing
        && _.chain( this.cell.getAdjacent8() )
          .some((_cell: Cell) => !(_cell.revealed || _cell.power.disabled)) // DO NOT REFER TO _CELL.DISABLED ... WILL CAUSE INFINITE LOOP!
          .value();
  }

  disableOther(cell: Cell): boolean {
    if (!this.attracting)
      return false;

    return _.chain( cell.getAdjacent8() )
      .every((_cell: Cell) => !(_cell.revealed && _cell.power instanceof MagnetPower))
      .value();
  }
}
