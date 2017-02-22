import { DeepLinkConfig } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { HomeOptionsPage } from '../pages/home/home-options';
import { GamePage } from '../pages/game/game';
import { PlayersPage } from '../pages/players/players';
import { PowersPage } from '../pages/powers/powers';

export const deepLinkConfig: DeepLinkConfig = {
  links: [
    { component: HomePage,    name: 'Home',     segment: 'home'                                         },
    { component: GamePage,    name: 'Game',     segment: 'home/game',     defaultHistory: [ HomePage ]  },
    { component: PlayersPage, name: 'Players',  segment: 'home/players',  defaultHistory: [ HomePage ]  },
    { component: PowersPage,  name: 'Powers',   segment: 'home/powers',   defaultHistory: [ HomePage ]  },
  ],
};

export const componentsConfig: any[] = [
  HomePage,
  HomeOptionsPage,
  GamePage,
  PlayersPage,
  PowersPage,
];
