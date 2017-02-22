import { GameMode } from './base';
import { Player } from '../../players/players';
import { Game, GamePlayer } from '../game';
import _ from 'lodash';

export class RaceMode extends GameMode {
  public get id(): string { return 'race'; }
  public get name(): string { return 'Race'; }

  get cap() { return 3; }

  public getPlayers(players: Player[]): Player[] {
    let plys = _.filter(players, (player) => player.score >= this.cap);
    return plys.length
      ? plys
      : players;
  }

  public gameEnded(loser: GamePlayer, game: Game): void {
    if (loser.score >= this.cap) {
      this._messages.next({
        text: `${ loser.name } is the loser!`,
        color: 'crimson',
      });
    }
  }
}
