import { Power } from './power';
import { Observable } from 'rxjs';
import _ from 'lodash';

const DIRECTIONS = [ 'left', 'up', 'right', 'down' ];

export class NoScopePower extends Power {
  private index: number = _.sample(_.range(4));

  get color(): string  { return 'orange'; }
  get icon(): string   { return `arrow-drop${ DIRECTIONS[this.index] }-circle`; }

  spin(): void {
    this.index = (this.index + 1) % 4;
    if (!this.cell[DIRECTIONS[this.index]])
      this.spin();
  }

  action(): Observable<any> {
    return Observable.race(
      Observable.interval(100)
        .do(() => this.spin())
        .ignoreElements(),

      Observable.timer(Math.random() * 2000 + 1000)
    )
      .delay(500)
      .flatMap(() => {
        let dir = DIRECTIONS[this.index];
        let results = [];
        let cursor = this.cell[dir];
        let delay = 0;

        while (cursor) {
          results.push(Observable.timer((delay++) * 100).concat(cursor.reveal()));
          cursor = cursor[dir];
        }

        return Observable.from(results);
      })
      .mergeAll();
  }
}
