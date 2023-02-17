import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private loadHeader=new BehaviorSubject(false);
  loadMessage=this.loadHeader.asObservable();

  constructor() { }
  loadComponent(message:any){
    this.loadHeader.next(message);
  }
}
