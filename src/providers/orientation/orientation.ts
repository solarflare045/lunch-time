import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ScreenOrientation } from 'ionic-native';
import { Observable } from 'rxjs';

@Injectable()
export class OrientationProvider {
  readonly lock: Observable<any>;

  constructor(private platform: Platform) {
    this.lock = this.platform.is('cordova')
      ? this._buildReal()
      : this._buildFake();
  }

  private _buildReal(): Observable<any> {
    return new Observable<any>((subscriber) => {
      ScreenOrientation.lockOrientation('portrait');
      return () => ScreenOrientation.unlockOrientation();
    }).publish().refCount();
  }

  private _buildFake(): Observable<any> {
    return Observable.never();
  }
}
