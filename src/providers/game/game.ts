import { Injectable } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import _ from 'lodash';

import { CellFactory } from '../cell/cell-factory';
import { Cell } from '../cell/cell';
import { Player } from '../players/players';

const WIDTH = 5;

@Injectable()
export class GameProvider {
  constructor(private cellFactory: CellFactory) {
    
  }

  create(players: Player[]): Game {
    return new Game(this.cellFactory, players);
  }

  reseed(seed: string): void {
    return this.cellFactory.reseed(seed);
  }
}

export class Game {
  private _board: Cell[] = [];
  private _busy: boolean;
  private _ended: boolean;

  private _turn: number = 0;
  private _repeat: number = 0;
  private _repeatNext: number = 0;
  private _turnStep: number = 1;

  private _haltTurn: Subject<any> = new Subject();

  constructor(private cellFactory: CellFactory, public readonly players: Player[]) {
    if (this.players.length === 0) {
      this._ended = true;
      return;
    }

    this.generate();
    this._turn = _.sample(_.range(players.length));
  }

  get board(): Cell[] {
    return this._board;
  }
  
  get ended(): boolean {
    return this._ended;
  }

  get turn(): number {
    return this._turn;
  }

  get extraTurns(): number {
    return this._repeat;
  }

  get isReversed(): boolean {
    return this._turnStep === -1;
  }

  end(): void {
    if (!this._ended)
      this.players[this.turn].score++;

    this._ended = true;
    _.each(this.board, (cell) => cell.setPower(cell.power, cell.power));
  }

  addRepeat(turns: number): void {
    this._repeat += turns;
  }

  addNextRepeat(turns: number): void {
    this._repeatNext += turns;
  }

  reverse(): void {
    this._turnStep = -this._turnStep;
  }

  haltTurn(): void {
    this._haltTurn.next();
  }

  passTurn(): void {
    if (this._repeat > 0) {
      this._repeat--;
      return;
    }

    this._repeat = this._repeatNext;
    this._repeatNext = 0;
    this._turn += this._turnStep;
    if (this._turn < 0) this._turn += this.players.length;
    if (this._turn >= this.players.length) this._turn -= this.players.length;
  }

  select(cell: Cell): Subscription {
    if (this._busy || cell.revealed || cell.disabled)
      return null;

    this._busy = true;
    return cell.reveal()
      .takeUntil(this._haltTurn)
      .subscribe({
        complete: () => {
          this._busy = false;
          this.passTurn();
        }
      });
  }

  private generate(): void {
    _.chain(_.range(WIDTH * WIDTH))
      .each(i => this._board[i] = this.cellFactory.create(this))
      .tap(is => this._board[_.sample(is)] = this.cellFactory.createLose(this))
      .each(i =>
        this._board[i]._setBorders(
          (i % WIDTH > 0) ? this._board[i - 1] : null,
          (i % WIDTH < WIDTH - 1) ? this._board[i + 1] : null,
          (i >= WIDTH) ? this._board[i - WIDTH] : null,
          (i < WIDTH * (WIDTH - 1)) ? this._board[i + WIDTH] : null
        )
      )
      .value();
  }
}