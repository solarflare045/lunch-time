import { Power } from './power';
import { Observable } from 'rxjs';

export class SkipPower extends Power {
  protected _icon: string = 'redo';

  get color(): string  { return 'lavender'; }
  get icon(): string   { return this._icon; }

  get animation(): string {
    return this.cell.revealing
      ? 'crazy'
      : null;
  }

  action(): Observable<any> {
    return Observable.defer(() => {
      this._icon = this.cell.game.isReversed
        ? 'undo'
        : 'redo';

      this.cell.game.addSkip();
      return Observable.timer(1250);
    });
  }
}
