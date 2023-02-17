import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface IDeactivate {
  canExit: () => Observable<boolean> | Promise<boolean> | boolean;
  }
@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuardService implements CanDeactivate<IDeactivate> {

  constructor() { }
  canDeactivate(component: IDeactivate,currentRoute:ActivatedRouteSnapshot,
    currentState:RouterStateSnapshot,nextState:RouterStateSnapshot) {
   return component.canExit();
  }
}
