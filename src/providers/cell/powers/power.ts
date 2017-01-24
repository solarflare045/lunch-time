import { Observable } from 'rxjs';
import { Cell } from '../cell';

export abstract class Power {
  constructor(public readonly cell: Cell) {
    if (cell)
      this.bound();
  }

  /**
   * Cell overrides.
   */
  public abstract action(): Observable<any>;
  public get animation(): string { return ''; }
  public abstract get color(): string;
  public abstract get icon(): string;
  public get disabled(): boolean { return false; }

  protected bound(): void { return; }

  protected get active(): boolean {
    return this.cell.power === this // The cell contains this power.
        && this.cell.revealed       // The cell is revealed.
        && !this.cell.game.ended;   // The game hasn't ended.
  }
}
