import { Observable } from 'rxjs';
import { Cell } from '../cell';

export abstract class Power {
  constructor(public readonly cell: Cell) {

  }

  /**
   * Cell overrides.
   */
  public abstract action(): Observable<any>;
  public get animation(): string { return ''; }
  public abstract get color(): string;
  public abstract get icon(): string;
}
