import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { deepLinkConfig, componentsConfig } from './routes';

import { MyApp } from './app.component';

import { CellFactory } from '../providers/cell/cell-factory';
import { CellConfigProvider } from '../providers/cell/cell-config';
import { GameProvider } from '../providers/game/game';
import { GameModeFactory } from '../providers/game/modes/';
import { OrientationProvider } from '../providers/orientation/orientation';
import { PlayersProvider } from '../providers/players/players';
import { QuantumProvider } from '../providers/quantum/quantum';

@NgModule({
  declarations: [
    MyApp,
    ...componentsConfig,
  ],
  imports: [
    IonicModule.forRoot(MyApp, {}, deepLinkConfig),
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [
    MyApp,
    ...componentsConfig,
  ],
  providers: [
    CellFactory,
    CellConfigProvider,
    GameProvider,
    GameModeFactory,
    OrientationProvider,
    PlayersProvider,
    QuantumProvider,
    Storage,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ],
})
export class AppModule {}
