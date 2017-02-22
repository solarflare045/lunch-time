import { GameMode } from './base';
import { Player } from '../../players/players';

export class FreeMode extends GameMode {
  public get id(): string { return 'free'; }
  public get name(): string { return 'Endless'; }

  public getPlayers(players: Player[]): Player[] {
    return players;
  }
}
