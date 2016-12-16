import { Power } from './power';
import { Observable } from 'rxjs';

export class LosePower extends Power {
  get color(): string  { return 'red'; }
  get icon(): string   { return 'restaurant'; }

  action(): Observable<any> {
    return Observable.forkJoin(
      Observable.timer(750).do(() => this.cell.game.end()),
      Observable.never()
    );
  }
}