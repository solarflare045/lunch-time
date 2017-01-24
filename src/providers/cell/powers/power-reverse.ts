import { Power } from './power';
import { Observable } from 'rxjs';

export class ReversePower extends Power {
  get color(): string  { return 'skyblue'; }
  get icon(): string   { return 'refresh'; }

  get animation(): string {
    return this.cell.revealing
      ? 'crazy'
      : null;
  }

  action(): Observable<any> {
    return Observable.defer(() => {
      this.cell.game.reverse();
      return Observable.timer(1250);
    });
  }
}
