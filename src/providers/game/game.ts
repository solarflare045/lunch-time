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

export class GamePlayer {
  get name(): string { return this.player.name; }
  get score(): number { return this.player.score; }

  crazy: boolean = false;
  bailed: boolean = false;

  constructor(public readonly player: Player) {
    if (~this.name.toLowerCase().indexOf('crazy'))
      this.setCrazy();
  }

  setBailed(): void {
    this.bailed = true;
    this.crazy = false;
  }

  setCrazy(): void {
    // A Bailed player cannot become crazy.
    this.crazy = !this.bailed;
  }

  lose(): void {
    this.player.score++;
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

  public readonly players: GamePlayer[];

  constructor(private cellFactory: CellFactory, players: Player[]) {
    this.players = _.chain(players)
      .map(player => new GamePlayer(player))
      .value();

    if (this.players.length === 0) {
      this._ended = true;
      return;
    }

    this.generate();
    this._turn = _.sample(_.range(players.length));
    this.startTurn();
  }

  get board(): Cell[] {
    return this._board;
  }

  get busy(): boolean {
    return this._busy;
  }
  
  get ended(): boolean {
    return this._ended;
  }

  get turn(): number {
    return this._turn;
  }

  get currentPlayer(): GamePlayer {
    return this.players[this.turn];
  }

  get extraTurns(): number {
    return this._repeat;
  }

  get isReversed(): boolean {
    return this._turnStep === -1;
  }

  end(): void {
    if (!this._ended)
      this.players[this.turn].lose();

    this._ended = true;
    _.each(this.board, (cell) => cell.setMark(cell.power));
  }

  addRepeat(turns: number): void {
    this._repeat += turns;
  }

  addNextRepeat(turns: number): void {
    this._repeatNext += turns;
  }

  resetRepeat(): void {
    this._repeat = 0;
  }

  reverse(): void {
    this._turnStep = -this._turnStep;
  }

  haltTurn(): void {
    this._haltTurn.next();
  }

  passTurn(): void {
    try {
      if (this._repeat > 0) {
        this._repeat--;
        return;
      }

      this._repeat = this._repeatNext;
      this._repeatNext = 0;

      do {
        this._turn += this._turnStep;
        if (this._turn < 0) this._turn += this.players.length;
        if (this._turn >= this.players.length) this._turn -= this.players.length;
      } while (this.currentPlayer.bailed);

    } finally {
      this.startTurn();
    }    
  }

  private startTurn(): void {
    if (this.currentPlayer.crazy) {
      let cells = _.chain(this.board)
        .filter(cell => !cell.disabled && !cell.revealed)
        .value();

      if (cells.length > 0)
        setTimeout(
          () => this.select(_.sample(cells)),
          1000
        );
    }
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