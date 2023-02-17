import { Injectable } from '@angular/core';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(service:LoginService) { }
  data=sessionStorage.getItem('userData');
  userInfo=(this.data)?JSON.parse(this.data):null;

  loggedIn(){
    if(this.userInfo!=null){
      return true;
    }
    else
    return false;
  }
  
}
