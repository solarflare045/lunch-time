import { Power } from './power';
import { Observable } from 'rxjs';

export class CrazyPower extends Power {
  get color(): string  { return 'crimson'; }
  get icon(): string   { return 'happy'; }

  get animation(): string {
    return this.cell.revealing
      ? 'crazy'
      : null;
  }

  action(): Observable<any> {
    return Observable.defer(() => {
      this.cell.game.currentPlayer.setCrazy();
      return Observable.timer(1250);
    })
  }
}