import { Power } from './power';
import { Observable } from 'rxjs';

export class BaitPower extends Power {
  get color(): string  {
    return this.cell.revealing
      ? 'red'
      : 'lightgreen';
  }

  get icon(): string   {
    return this.cell.revealing
      ? 'restaurant'
      : 'checkmark';
  }

  action(): Observable<any> {
    return Observable.timer(750);
  }
}