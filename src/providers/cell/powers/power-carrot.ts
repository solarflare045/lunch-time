import { Power } from './power';
import { Observable } from 'rxjs';
import { GamePlayer } from '../../game/game';
import _ from 'lodash';

import { LosePower } from './power-lose';

export class CarrotPower extends Power {
  get color(): string   { return 'Plum'; }
  get icon(): string    { return 'nutrition'; }

  get animation(): string {
    return this.cell.revealing
      ? 'flashing'
      : null;
  }

  action(): Observable<any> {
    return Observable.defer(() => {
      let cells = _.chain(this.cell.game.board)
        .filter((cell) => !cell.revealed)
        .filter((cell) => !(cell.power instanceof LosePower))
        .value();

      let cell = _.sample(cells);
      let lock = new LockedLoseSquare(cell);
      lock.owner = this.cell.game.currentPlayer;

      if (cell) {
        cell.setPower(lock);
        cell.setMark(lock);
      }

      return Observable.timer(1000);
    });
  }
}

export class LockedLoseSquare extends LosePower {
  owner: GamePlayer = null;

  get disabled(): boolean {
    return this.cell.game.currentPlayer === this.owner;
  }
}
