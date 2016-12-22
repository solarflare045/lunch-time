import { Injectable } from '@angular/core';
import seedrandom from 'seedrandom';

import { Game } from '../game/game';

import { Cell } from './cell';
import { CellConfigProvider, PowerType } from './cell-config';
import { LosePower } from './powers/power-lose';

@Injectable()
export class CellFactory {
  private random = seedrandom()

  constructor(private cellConfig: CellConfigProvider) {

  }

  create(game: Game): Cell {
    return this.build(
      game,
      this.cellConfig.buildRandom(this.random).next() || LosePower
    );
  }

  createLose(game: Game): Cell {
    return this.build(game, LosePower);
  }

  reseed(seed: string): void {
    this.random = seedrandom(seed);
  }

  private build(game: Game, PowerClass: PowerType) {
    let cell = new Cell(game);
    let power = new PowerClass(cell);
    cell.setPower(power);
    return cell;
  }
}
