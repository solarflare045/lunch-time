import { Power } from './power';
import { Observable } from 'rxjs';
import _ from 'lodash';

import { SafePower } from './power-safe';
import { LosePower } from './power-lose';

export class KeyPower extends Power {
  get color(): string  { return 'MediumSeaGreen'; }
  get icon(): string   { return 'key'; }

  get animation(): string {
    return this.cell.revealing
      ? 'flashing'
      : null;
  }

  action(): Observable<any> {
    return Observable.defer(() => {
      let cells = _.chain(this.cell.game.board)
        .filter((cell) => !cell.revealed)
        .filter((cell) => !(cell.power instanceof LosePower || cell.power instanceof LockedPower))
        .value();

      let cell = _.sample(cells);
      let lock = new LockedPower(cell);
      lock.owner = this.cell.game.turn;

      if (cell) {
        cell.setPower(lock);
        cell.setMark(lock);
      }

      return Observable.timer(1000);
    });
  }
}

class LockedPower extends Power {
  owner: number = null;

  get color(): string  { return null; }
  get disabled(): boolean { return this.cell.game.turn !== this.owner; }
  get icon(): string   {
    return this.disabled
      ? 'lock'
      : 'unlock';
  }
  
  get text(): string {
    return this.disabled
      ? this.cell.game.players[this.owner].name
      : '';
  }
  
  action(): Observable<any> {
    return Observable.defer(() => {
      this.cell.setPower(new SafePower(this.cell));
      return Observable.empty();
    });
  }
}
