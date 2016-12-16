import { Power } from './power';
import { Observable } from 'rxjs';

export class ThunderDomePower extends Power {
  get color(): string  { return 'slateblue'; }
  get icon(): string   { return 'thunderstorm'; }

  get animation(): string {
    return this.cell.revealing
      ? 'flashing'
      : null;
  }

  action(): Observable<any> {
    return Observable.defer(() => {
      this.cell.game.addRepeat(2);
      this.cell.game.addNextRepeat(4);
      return Observable.timer(1000);
    });
  }
}