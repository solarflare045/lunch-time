import _ from 'lodash';
import { Observable } from 'rxjs';
import { Game } from '../game/game';
import { Power } from './powers/power';

export class Cell {
  constructor(public readonly game: Game) {

  }

  /**
   * Readable properties.
   */
  public get color(): string {
    return this._revealed
      ? this._power.color
      : 'gray';
  }

  public get icon(): string {
    return this._revealed
      ? this._power.icon
      : (
          this._mark
            ? this._mark.icon
            : null
        );
  }

  public get animation(): string {
    return this._power.animation;
  }

  public get disabled(): boolean {
    return this._power.disabled;
  }

  public get revealed(): boolean {
    return this._revealed;
  }

  public get revealing(): boolean {
    return this._revealing;
  }

  public get power(): Power {
    return this._power;
  }

  public get state(): string {
    return this.revealed
      ? 'revealed'
      : (
          this.disabled
            ? 'disabled'
            : 'hidden'
        );
  }
  
  /**
   * Properties.
   */
  protected _power: Power;
  protected _mark: Power;

  protected left: Cell;
  protected right: Cell;
  protected up: Cell;
  protected down: Cell;

  protected _revealed: boolean = false;
  protected _revealing: boolean = false;

  /**
   * Setup assistant.
   */
  _setBorders(left: Cell, right: Cell, up: Cell, down: Cell) {
    this.left = left;
    this.right = right;
    this.up = up;
    this.down = down;
  }

  setPower(power: Power) {
    this._power = power;
  }

  setMark(mark: Power = null) {
    this._mark = mark;
  }

  /**
   * Base functionality.
   */
  reveal(): Observable<any> {
    return Observable.defer(() => {
      if (this._revealed)
        return Observable.empty();

      if (this._power.disabled)
        return Observable.empty();

      this._revealed = true;
      this._revealing = true;
      return this._power.action()
        .do({ complete: () => this._revealing = false });
    });
  }

  hide(): void {
    this._revealed = false;
  }

  /**
   * Adjacency helpers.
   */
  public getAdjacent(): Cell[] {
    return _.compact([ this.left, this.up, this.right, this.down ]);
  }

  public getLinear(): Cell[] {
    let properties: string[] = [ 'left', 'right', 'up', 'down' ];
    let results: Cell[] = [];
    _.forEach(properties, (property) => {
      let cursor = this;
      while(cursor[property]) {
        cursor = cursor[property];
        results.push(cursor);
      }
    });
    return results;
  }
}
