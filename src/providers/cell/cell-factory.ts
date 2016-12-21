import { Injectable } from '@angular/core';
import _ from 'lodash';
import seedrandom from 'seedrandom';

import { Game } from '../game/game';

import { Cell } from './cell';
import { AttackPower } from './powers/power-attack';
import { BailOutPower } from './powers/power-bailout';
import { BaitPower } from './powers/power-bait';
import { BombPower } from './powers/power-bomb';
import { BuoyPower } from './powers/power-buoy';
import { KeyPower } from './powers/power-key';
import { NoScopePower } from './powers/power-noscope';
import { NuclearPower } from './powers/power-nuclear';
import { LosePower } from './powers/power-lose';
import { ReversePower } from './powers/power-reverse';
import { SafePower } from './powers/power-safe';
import { TerrifyPower } from './powers/power-terrify';
import { ThunderDomePower } from './powers/power-thunderdome';
import { WifiPower } from './powers/power-wifi';

@Injectable()
export class CellFactory {
  private random = seedrandom()

  create(game: Game): Cell {
    let rnd = this.random();
    let cls;

    if (rnd < 0.02)
      cls = WifiPower;        // 02%

    else if (rnd < 0.03)
      cls = NuclearPower;     // 01%

    else if (rnd < 0.05)
      cls = BaitPower;        // 02%

    else if (rnd < 0.13)
      cls = NoScopePower;     // 08%

    else if (rnd < 0.21)
      cls = BombPower;        // 08%

    else if (rnd < 0.23)
      cls = TerrifyPower;     // 02%

    else if (rnd < 0.35)
      cls = AttackPower;      // 12%

    else if (rnd < 0.40)
      cls = ReversePower;     // 05%

    else if (rnd < 0.42)
      cls = ThunderDomePower; // 02%

    else if (rnd < 0.45)
      cls = KeyPower;         // 03%

    else if (rnd < 0.50)
      cls = BuoyPower;        // 05%

    else if (rnd < 0.51)
      cls = BailOutPower;     // 01%

    else
      cls = SafePower;

    return this.build(game, cls);
  }

  createLose(game: Game): Cell {
    return this.build(game, LosePower);
  }

  reseed(seed: string): void {
    this.random = seedrandom(seed);
  }

  private build(game: Game, PowerClass: any) {
    let cell = new Cell(game);
    let power = new PowerClass(cell);
    cell.setPower(power);
    return cell;
  }
}

