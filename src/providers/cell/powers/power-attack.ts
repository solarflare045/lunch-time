import { Power } from './power';
import { Observable } from 'rxjs';

export class AttackPower extends Power {
  get color(): string  { return 'gold'; }
  get icon(): string   { return 'flash'; }

  action(): Observable<any> {
    return Observable.defer(() => {
      this.cell.game.addNextRepeat(1);
      return Observable.empty();
    });
  }
}