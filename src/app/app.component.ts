import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CandidateProfiles';
  headerEvent:boolean=true;

  update(event:any){
    console.log(event)
    this.headerEvent=event;
  }
  
}


