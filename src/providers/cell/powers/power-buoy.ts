import { Power } from './power';
import { Observable } from 'rxjs';
import _ from 'lodash';

export class BuoyPower extends Power {
  get color(): string  { return 'pink'; }
  get icon(): string   { return 'help-buoy'; }

  action(): Observable<any> {
    return Observable.empty();
  }

  bound(): void {
    this.cell.setMark(this);
    console.log('Bound?');
  }

  get disabled(): boolean {
    let curScore = this.cell.game.currentPlayer.score;
    return !!_.find(this.cell.game.players, player => player.score > curScore);
  }
}