import { Power } from './power';
import { Observable } from 'rxjs';
import _ from 'lodash';

export class BailOutPower extends Power {
  get color(): string  { return 'RoyalBlue'; }
  get icon(): string   { return 'beer'; }

  get animation(): string {
    return this.cell.revealing
      ? 'flashing'
      : null;
  }

  action(): Observable<any> {
    return Observable.defer(() => {
      let remaining = _.filter(this.cell.game.players, (player) => !player.bailed).length;

      if (remaining > 1)
        this.cell.game.resetRepeat();

      if (remaining > 2)
        this.cell.game.currentPlayer.bailOut();

      return Observable.empty();
    })
  }
}