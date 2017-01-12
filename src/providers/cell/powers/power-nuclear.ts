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
    return Observable.timer(250)
      .flatMap(() => {
        let delay = 20;

        return Observable.from(
          _.chain(this.cell.game.board)
            .filter((cell) => !cell.disabled && Math.random() < 0.5)
            .each((cell) => cell.setMark(this))
            .shuffle()
            .map((cell) => Observable.timer((delay++) * 100).concat(cell.reveal()))
            .value()
        );
      })
      .mergeAll();
  }
}
