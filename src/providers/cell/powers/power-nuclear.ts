import { Power } from './power';
import { Observable } from 'rxjs';
import _ from 'lodash';

export class NuclearPower extends Power {
  get color(): string  { return 'firebrick'; }
  get icon(): string   { return 'nuclear'; }

  get animation(): string {
    return this.cell.revealing
      ? 'shaking'
      : null;
  }

  action(): Observable<any> {
    return Observable.timer(2000)
      .flatMap(() =>
        Observable.from(
          _.chain(this.cell.game.board)
            .filter(cell => Math.random() < 0.5)
            .map(cell => cell.reveal())
            .shuffle()
            .value()
        )
      )
      .mergeAll();
  }
}