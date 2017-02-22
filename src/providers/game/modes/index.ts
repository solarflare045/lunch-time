import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Subject, ReplaySubject } from 'rxjs';
import _ from 'lodash';
import { GameMode, IMessage } from './base';
import { FreeMode } from './free.mode';
import { EliminationMode } from './elimination.mode';
import { RaceMode } from './race.mode';

export { GameMode, IMessage };

const MODE_CONFIG = 'MODE';

@Injectable()
export class GameModeFactory {
  public readonly MODES: { [key: string]: GameMode, default: GameMode } = {
    default: new FreeMode(this),
    elimination: new EliminationMode(this),
    race: new RaceMode(this),
  };

  private _mode: GameMode;
  private _config: { id: string };
  private _mode$: Subject<GameMode> = new ReplaySubject<GameMode>(1);

  public readonly modes = _.values(this.MODES);
  public readonly messages = this._mode$.switchMap((mode) => mode.messages);

  constructor(private storage: Storage) {
    this._mode = this.build();
    this._mode$.next( this._mode );
  }

  load(): Promise<any> {
    return this.storage.get(MODE_CONFIG).then((config) => {
      this._config = config || {};
      if (this._config.id)
        this.changeModeId(this._config.id);
    });
  }

  build(mode: string = ''): GameMode {
    return this.MODES[mode] || this.MODES.default;
  }

  get mode(): GameMode { return this._mode; }

  changeMode(mode: GameMode) {
    this._mode = mode;
    this._mode$.next( this._mode );
    this.saveConfig('id', mode.id);
  }

  changeModeId(modeId: string = '') {
    this.changeMode( this.build(modeId) );
  }

  getConfig<T>(key: string): T {
    return _.get<T>(this._config, key);
  }

  saveConfig<T>(key: string, value: T) {
    _.set<T>(this._config, key, value);
    this.writeConfig();
  }

  private writeConfig() {
    this.storage.set(MODE_CONFIG, this._config);
  }
}
