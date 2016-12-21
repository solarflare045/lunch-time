import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import _ from 'lodash';

import { Power } from './powers/power';

import { AttackPower } from './powers/power-attack';
import { BailOutPower } from './powers/power-bailout';
import { BaitPower } from './powers/power-bait';
import { BombPower } from './powers/power-bomb';
import { BuoyPower } from './powers/power-buoy';
import { CrazyPower } from './powers/power-crazy';
import { KeyPower } from './powers/power-key';
import { NoScopePower } from './powers/power-noscope';
import { NuclearPower } from './powers/power-nuclear';
import { ReversePower } from './powers/power-reverse';
import { SafePower } from './powers/power-safe';
import { TerrifyPower } from './powers/power-terrify';
import { ThunderDomePower } from './powers/power-thunderdome';
import { WifiPower } from './powers/power-wifi';

const STORAGE_KEY: string = 'PowerConfig';

export declare type PowerType = Function & typeof Power;

interface PowerSetup {
  id: string;
  name: string;
  weight: number;
  power: PowerType;
}

interface PowerConfig {
  [ id: string ]: number;
}

export const SETUP: PowerSetup[] = [
  { id: 'atk',  name: 'Attack',       weight: 12, power: AttackPower      },
  { id: 'bal',  name: 'Bail Out',     weight: 1,  power: BailOutPower     },
  { id: 'bat',  name: 'Bait',         weight: 2,  power: BaitPower        },
  { id: 'bmb',  name: 'Bomb',         weight: 8,  power: BombPower        },
  { id: 'buo',  name: 'Buoy',         weight: 5,  power: BuoyPower        },
  { id: 'cra',  name: 'Craze',        weight: 1,  power: CrazyPower       },
  { id: 'dws',  name: 'Dowse',        weight: 2,  power: WifiPower        },
  { id: 'ill',  name: 'Illuminati',   weight: 2,  power: TerrifyPower     },
  { id: 'key',  name: 'Key',          weight: 3,  power: KeyPower         },
  { id: 'nos',  name: 'No Scope',     weight: 8,  power: NoScopePower     },
  { id: 'nuk',  name: 'Nuke',         weight: 1,  power: NuclearPower     },
  { id: 'rev',  name: 'Reverse',      weight: 5,  power: ReversePower     },
  { id: 'saf',  name: 'Safe',         weight: 52, power: SafePower        },
  { id: 'thd',  name: 'Thunder Dome', weight: 2,  power: ThunderDomePower }
]

export class PowerOption {
  constructor(
    private base: PowerSetup,
    private configSet: PowerConfig,
    private cellProvider: CellConfigProvider
  ) {

  }

  private get id(): string { return this.base.id; };
  get name(): string { return this.base.name; };
  get power(): PowerType { return this.base.power; };
  get chance(): number { return this.cellProvider.getChanceFromWeight(this.weight); };

  get weight(): number {
    return this.configSet[this.id] === undefined
      ? this.base.weight
      : this.configSet[this.id];
  };

  set weight(val: number) {
    this.configSet[this.id] = val;
    this.cellProvider.saveConfig();
  }
}

@Injectable()
export class CellConfigProvider {
  private options: PowerOption[];
  private config: PowerConfig;

  constructor(private storage: Storage) {
    this.storage.get(STORAGE_KEY)
      .then((config: PowerConfig) => {
        this.config = config || {};
        this.options = _.map(SETUP, power => new PowerOption(power, this.config, this));
      });
  }

  saveConfig(): void {
    this.storage.set(STORAGE_KEY, this.config);
  }

  get totalWeight(): number {
    return _.sumBy(this.options, 'weight');
  }

  getChanceFromWeight(weight: number): number {
    let total = this.totalWeight || 1;
    return weight / total;
  }

  buildRandom(random: () => number = Math.random): IPowerRandomer {
    let options: PowerOption[] = [];
    _.each(this.options, power => _.times(power.weight, () => options.push(power)));

    if (!options.length)
      return new PowerRandomizerEmpty();

    return new PowerRandomizer(random, options);
  }
}

export interface IPowerRandomer {
  next(): PowerType;
}

export class PowerRandomizer implements IPowerRandomer {
  constructor(
    private random: () => number,
    private options: PowerOption[]
  ) {

  }

  next(): PowerType {
    return this.options[ Math.floor(this.random() * this.options.length) ].power;
  }
}

export class PowerRandomizerEmpty implements IPowerRandomer {
  next(): PowerType {
    return null;
  }
}