import { DeepLinkConfig } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { HomeOptionsPage } from '../pages/home/home-options';
import { PlayersPage } from '../pages/players/players';
import { PowersPage } from '../pages/powers/powers';

export const deepLinkConfig: DeepLinkConfig = {
  links: [
    { component: HomePage,    name: 'Home',     segment: 'home'                                       },
    { component: PlayersPage, name: 'Players',  segment: 'home/players',  defaultHistory: [HomePage]  },
    { component: PowersPage,  name: 'Powers',   segment: 'home/powers',   defaultHistory: [HomePage]  }
  ]
};

export const componentsConfig: any[] = [
  HomePage,
  HomeOptionsPage,
  PlayersPage,
  PowersPage
];
