import { Injectable } from '@angular/core';

@Injectable()
export class PlayersProvider {
  readonly empty: Player = new Player('Unknown');
  readonly players: Player[] = [];

  get count(): number {
    return this.players.length;
  }

  add(name: string): Player {
    let newPlayer = new Player(name);
    this.players.push(newPlayer);
    return newPlayer;
  }

  delete(index: number): void {
    this.players.splice(index, 1);
  }

  swap(fromIndex: number, toIndex: number): void {
    [ this.players[toIndex], this.players[fromIndex] ] = [ this.players[fromIndex], this.players[toIndex] ];
  }
}

export class Player {
  icon: string = '';
  score: number = 0;

  constructor(public name: string) {

  }
}