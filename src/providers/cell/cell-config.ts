import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import _ from 'lodash';

import { Cell } from './cell';
import { Power } from './powers/power';

import { AlarmPower } from './powers/power-alarm';
import { AttackPower } from './powers/power-attack';
import { BailOutPower } from './powers/power-bailout';
import { BaitPower } from './powers/power-bait';
import { BombPower } from './powers/power-bomb';
import { BuoyPower } from './powers/power-buoy';
import { CarrotPower } from './powers/power-carrot';
import { CrazyPower } from './powers/power-crazy';
import { FlaskPower } from './powers/power-flask';
import { KeyPower } from './powers/power-key';
import { MagnetPower } from './powers/power-magnet';
import { NoScopePower } from './powers/power-noscope';
import { NuclearPower } from './powers/power-nuclear';
import { ReversePower } from './powers/power-reverse';
import { SafePower } from './powers/power-safe';
import { SkipPower } from './powers/power-skip';
import { TerrifyPower } from './powers/power-terrify';
import { ThunderDomePower } from './powers/power-thunderdome';
import { WifiPower } from './powers/power-wifi';

const STORAGE_KEY: string = 'PowerConfig';

export declare type PowerType = Function & typeof Power;

interface PowerSetup {
  id: string;
  name: string;
  desc: string;
  weight: number;
  power: PowerType;
}

interface PowerConfig {
  [ id: string ]: number;
}

export const SETUP: PowerSetup[] = [
  { id: 'ala',  name: 'Alarm',        weight: 1,  power: AlarmPower       , desc: 'Kills the current player when it randomly detonates.' },
  { id: 'atk',  name: 'Attack',       weight: 12, power: AttackPower      , desc: 'Next player takes additional turn.' },
  { id: 'bal',  name: 'Bail Out',     weight: 1,  power: BailOutPower     , desc: 'Cancels your extra turns. May remove you from the round!' },
  { id: 'bat',  name: 'Bait',         weight: 2,  power: BaitPower        , desc: 'Makes you panic, but is harmless.' },
  { id: 'bmb',  name: 'Bomb',         weight: 8,  power: BombPower        , desc: 'Also activately adjecent tiles.' },
  { id: 'buo',  name: 'Buoy',         weight: 5,  power: BuoyPower        , desc: 'Safe, but only usable by losing players.' },
  { id: 'cra',  name: 'Craze',        weight: 1,  power: CrazyPower       , desc: 'For the rest of the round, you choose at random.' },
  { id: 'crt',  name: 'Carrot',       weight: 4,  power: CarrotPower      , desc: 'Adds a marked Lose square that you cannot press.' },
  { id: 'dws',  name: 'Dowse',        weight: 2,  power: WifiPower        , desc: 'Reveals all SAFE tiles in the same row and column.' },
  { id: 'fla',  name: 'Flask',        weight: 3,  power: FlaskPower       , desc: 'Reusable, but might cause a loss.' },
  { id: 'ill',  name: 'Illuminati',   weight: 2,  power: TerrifyPower     , desc: 'Hides some revealed tiles, then changes their power.' },
  { id: 'key',  name: 'Key',          weight: 3,  power: KeyPower         , desc: 'Provides you a safe square that only you can use.' },
  { id: 'mgn',  name: 'Magnet',       weight: 3,  power: MagnetPower      , desc: 'Forces all players to pick adjacent squares.' },
  { id: 'nos',  name: 'No Scope',     weight: 8,  power: NoScopePower     , desc: 'Activates all tiles in a random direction.' },
  { id: 'nuk',  name: 'Nuke',         weight: 1,  power: NuclearPower     , desc: 'Randomly activates all other tiles.' },
  { id: 'rev',  name: 'Reverse',      weight: 9,  power: ReversePower     , desc: 'Reverses the turn order.' },
  { id: 'saf',  name: 'Safe',         weight: 52, power: SafePower        , desc: 'No effect.' },
  { id: 'skp',  name: 'Skip',         weight: 8,  power: SkipPower        , desc: 'Skips the next player.' },
  { id: 'thd',  name: 'Thunderdome',  weight: 2,  power: ThunderDomePower , desc: 'You take extra turns. Next player takes a lot more.' },

  /** Used IDs **/
//{ id: 'wfi',  name: 'Wild Fire',    weight: 2,  power: FirePower        , desc: 'Slowly burns away squares.' },
];

export class PowerOption {
  constructor(
    private base: PowerSetup,
    private configSet: PowerConfig,
    private cellProvider: CellConfigProvider
  ) {
    this.instance = new base.power( new Cell(null) );
  }

  readonly instance: Power;
  private get id(): string { return this.base.id; }
  get name(): string { return this.base.name; }
  get description(): string { return this.base.desc; }
  get power(): PowerType { return this.base.power; }
  get chance(): number { return this.cellProvider.getChanceFromWeight(this.weight); }

  get weight(): number {
    return this.configSet[this.id] === undefined
      ? this.base.weight
      : this.configSet[this.id];
  }

  set weight(val: number) {
    this.configSet[this.id] = val;
    this.cellProvider.saveConfig();
  }
}

@Injectable()
export class CellConfigProvider {
  private _options: PowerOption[] = [];
  private _config: PowerConfig = {};

  constructor(private storage: Storage) {
    this.storage.get(STORAGE_KEY)
      .then((config: PowerConfig) => {
        this._config = config || {};
        this._options = _.map(SETUP, (power) => new PowerOption(power, this._config, this));
      });
  }

  saveConfig(): void {
    this.storage.set(STORAGE_KEY, this._config);
  }

  resetConfig(): void {
    _.each(this._config, (v, k) => delete this._config[k]);
    this.saveConfig();
  }

  get options(): PowerOption[] {
    return this._options;
  }

  get totalWeight(): number {
    return _.sumBy(this._options, 'weight');
  }

  getChanceFromWeight(weight: number): number {
    let total = this.totalWeight || 1;
    return weight / total;
  }

  buildRandom(random: () => number = Math.random): IPowerRandomer {
    let sum = 0;
    let options: CappedWeightOption[] = _.chain(this._options)
      .filter((option) => option.weight)
      .map((option) => ({
        power: option.power,
        cumWeight: sum += option.weight,
      }))
      .value();

    if (!options.length)
      return new PowerRandomizerEmpty();

    return new PowerRandomizer(random, options, sum);
  }
}

interface CappedWeightOption {
  power: PowerType;
  cumWeight: number;
}

export interface IPowerRandomer {
  next(): PowerType;
}

export class PowerRandomizer implements IPowerRandomer {
  constructor(
    private random: () => number,
    private options: CappedWeightOption[],
    private total: number,
  ) {

  }

  next(): PowerType {
    let weight = Math.floor(this.random() * this.total);
    return _.find( this.options, (option) => option.cumWeight > weight ).power;
  }
}

export class PowerRandomizerEmpty implements IPowerRandomer {
  next(): PowerType {
    return null;
  }
}
