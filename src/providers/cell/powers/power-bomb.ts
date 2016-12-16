import { Power } from './power';
import { Observable } from 'rxjs';

export class BombPower extends Power {
  get color(): string  { return 'darkorange'; }
  get icon(): string   { return 'warning'; }

  get animation(): string {
    return this.cell.revealing
      ? 'shaking'
      : null;
  }

  action(): Observable<any> {
    console.log(this.cell.getAdjacent());
    return Observable.from(this.cell.getAdjacent())
      .map(cell =>
        cell.revealed
          ? Observable.empty()
          : Observable.timer(750).concat(cell.reveal())
      )
      .mergeAll();
  }
}