import { Power } from './power';
import { Observable } from 'rxjs';

export class ReversePower extends Power {
  get color(): string  { return 'skyblue'; }
  get icon(): string   { return 'refresh'; }

  action(): Observable<any> {
    return Observable.defer(() => {
      this.cell.game.reverse();
      return Observable.empty();
    });
  }
}
