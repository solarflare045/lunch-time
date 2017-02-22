import { Observable, Subject } from 'rxjs';
import { Player } from '../../players/players';
import { Game, GamePlayer } from '../game';
import { GameModeFactory } from './';

export interface IMessage {
  text: string;
  color: string;
}

export abstract class GameMode {
  public abstract get id(): string;
  public abstract get name(): string;

  public abstract getPlayers(players: Player[]): Player[];
  public gameEnded(loser: GamePlayer, game: Game): void { return; }

  protected readonly _messages: Subject<IMessage> = new Subject<IMessage>();
  public readonly messages: Observable<IMessage> = this._messages.asObservable();

  constructor(protected factory: GameModeFactory) { }
}
