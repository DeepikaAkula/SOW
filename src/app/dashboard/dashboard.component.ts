import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  Username:string="";
  
  constructor() {
    
   }

  ngOnInit(): void {
    this.Username=this.getUserName();
  }
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;
  getUserName():any{
    let data = sessionStorage.getItem('userData');
    let userInfo = (data) ? JSON.parse(data) : null;
    return userInfo.LoginName;
  }
}
