import { GameMode } from './base';
import { Player } from '../../players/players';
import { Game, GamePlayer } from '../game';
import _ from 'lodash';

export class EliminationMode extends GameMode {
  public get id(): string { return 'elimination'; }
  public get name(): string { return 'Elimination'; }

  get cap() { return 3; }

  public getPlayers(players: Player[]): Player[] {
    return _.filter(players, (player) => player.score < this.cap);
  }

  public gameEnded(loser: GamePlayer, game: Game): void {
    if (loser.score >= this.cap) {
      this._messages.next({
        text: `${ loser.name } has been eliminated!`,
        color: 'crimson',
      });
    }    
    
    let remaining = _.filter(game.players, (player) => player.score < this.cap);

    if (remaining.length === 1) {
      this._messages.next({
        text: `${ _.first(remaining).name } is the winner!`,
        color: '#32db64',
      });
    }
  }
}
