import { Power } from './power';
import { Observable } from 'rxjs';

export class SafePower extends Power {
  get color(): string  { return 'white'; }
  get icon(): string   { return 'checkmark'; }

  action(): Observable<any> {
    return Observable.empty();
  }
}