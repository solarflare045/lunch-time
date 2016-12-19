import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const PLAYERS = 'PLAYERS';

@Injectable()
export class PlayersProvider {
  readonly players: Player[] = [];

  constructor(private storage: Storage) { }

  load(): Promise<any>{
    return this.storage.get(PLAYERS).then((players) => {
      if (players) {
        this.players.length = 0; //clear the array (should be empty anyway, just checking)
        for (const player of players) {
          this.players.push(new Player(player));
        }
      }
    })
  }

  get count(): number {
    return this.players.length;
  }

  add(name: string): Player {
    let newPlayer = new Player(name);
    this.players.push(newPlayer);
    this.save();
    return newPlayer;
  }

  delete(index: number): void {
    this.players.splice(index, 1);
    this.save();
  }

  swap(fromIndex: number, toIndex: number): void {
    [ this.players[toIndex], this.players[fromIndex] ] = [ this.players[fromIndex], this.players[toIndex] ];
    this.save();
  }

  save(): void {
    this.storage.set(PLAYERS, this.players.map((player) => player.name));
  }
}

export class Player {
  icon: string = '';
  score: number = 0;

  constructor(public name: string) {

  }
}
