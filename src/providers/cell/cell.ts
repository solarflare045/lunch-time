import _ from 'lodash';
import { Observable } from 'rxjs';
import { Game } from '../game/game';
import { Power } from './powers/power';

import { NuclearPower } from './powers/power-nuclear';

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

  public get text(): string {
    return this._power.text;
  }

  public get disabled(): boolean {
    return !(this._mark instanceof NuclearPower)
        &&  (
                this._power.disabled
            ||  _.some(this.game.board, (cell) => cell.power.disableOther(this))
            );
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

      if (this.disabled)
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

  public getAdjacent8(): Cell[] {
    let cells: Cell[] = [];

    if (this.left)  cells.push( this.left,  this.left.up,   this.left.down  );
    if (this.right) cells.push( this.right, this.right.up,  this.right.down );
    if (this.up)    cells.push( this.up,    this.up.left,   this.up.right   );
    if (this.down)  cells.push( this.down,  this.down.left, this.down.right );

    return _.chain(cells)
      .compact()
      .uniq()
      .value();
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
