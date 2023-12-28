import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateService {
  private _mode: 'canvas' | 'text' = 'canvas';

  constructor() { }

  get mode(): 'canvas' | 'text' {
    return this._mode;
  }
}
