import { Component } from '@angular/core';
import { GameMode, GameModeFactory } from '../../providers/game/modes/';

@Component({
  templateUrl: './game.html',
})
export class GamePage {
  modes: GameMode[];

  constructor(private factory: GameModeFactory) {
    this.modes = this.factory.modes;
  }

  get gameMode(): string {
    return this.factory.mode.id;
  }

  set gameMode(val: string) {
    this.factory.changeModeId(val);
  }
}
