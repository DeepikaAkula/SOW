import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit  {
  sow: boolean = false;
  candidatedetails: boolean = false;
  mapping: boolean = false;
  domain: boolean = false;
  technology: boolean = false;
  login: boolean = false;
  dashboard: boolean = false;
  header:boolean=false;
  public isChecked = true;
  @Output() eventChange:EventEmitter<boolean> =new EventEmitter<boolean>();

  constructor(private commonServ:CommonService) { }

  ngOnInit(): void {
    this.commonServ.loadMessage.subscribe(data =>{
      if(data){
        if (sessionStorage.getItem('userData') != null || sessionStorage.getItem('userData') != undefined) {
          this.header=true;
          this.dashboard = true;
          this.login = true;
          let data = sessionStorage.getItem('userData');
          let resData = (data) ? JSON.parse(data) : null;
          let ScreenNames = resData.ScreenNames.split(',');
          if(sessionStorage.getItem('toggle')!=null || sessionStorage.getItem('toggle') != undefined){
            let obj=sessionStorage.getItem('toggle');
            let objData=(obj) ? JSON.parse(obj) : null;
            for (let key of Object.keys(objData)) {
              if ( key == 'sow') {
                this.sow = objData.sow;
              }
              if (key == 'candidatedetails') {
                this.candidatedetails = objData.candidatedetails;
              }
              if (key == 'mapping') {
                this.mapping = objData.mapping ;
              }
              if (key == 'domain') {
                this.domain = objData.domain;
              }
              if (key == 'technology') {
                this.technology = objData.technology;
              }
            }
          }
          else{
            for (let i = 0; i < ScreenNames.length; i++) {
              if (ScreenNames[i].toLowerCase() == 'sow') {
                this.sow = true;
              }
              if (ScreenNames[i].toLowerCase() == 'candidatedetails') {
                this.candidatedetails = true;
              }
              if (ScreenNames[i].toLowerCase() == 'mapping') {
                this.mapping = true;
              }
              if (ScreenNames[i].toLowerCase() == 'domain') {
                this.domain = true;
              }
              if (ScreenNames[i].toLowerCase() == 'technology') {
                this.technology = true;
              }
            }
            let obj={sow:this.sow,candidatedetails:this.candidatedetails,mapping:this.mapping,domain:this.domain,technology:this.technology}
            sessionStorage.setItem('toggle',JSON.stringify(obj))
          }
        }    
      }
    })  
    
  }
  update() {
    this.eventChange.emit(this.isChecked);
  }

  logOut() {
    this.header=false
    this.setAllDefaults();
    sessionStorage.clear();
  }
  setAllDefaults() {
    this.sow = false;
    this.candidatedetails = false;
    this.mapping = false;
    this.domain = false;
    this.technology = false;
    this.login = false;
    this.dashboard = false;
  }
  onclick() {
    this.isChecked = false;
    this.eventChange.emit(this.isChecked);
  }
}
