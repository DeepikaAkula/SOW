import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup ,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted: boolean = false
  userData: any;
  resultloader:boolean=false;
  
  constructor(private service: LoginService, private router: Router,private common:CommonService) { }

  ngOnInit(): void {

  }
  loginForm = new FormGroup({
    loginName: new FormControl('',[Validators.required]),
    loginPassword: new FormControl('',[Validators.required]),
  })
  onSubmit() {
    console.log(this.loginForm.value);
    this.submitted = true;
    if (this.loginForm.invalid) {
      alert("Invalid Credentials")
      return;
    }
    else {
      this.checkUserisValid();

    }
  }
  get f(){ return this.loginForm.controls;}
  async checkUserisValid() {
    let formValue = this.loginForm.value;
    let httpParams = new HttpParams().append("loginName", formValue.loginName).append("loginPassword", formValue.loginPassword);
    this.resultloader=true;
    await this.service.GetUserData(httpParams).subscribe(res => {
      if (res.Status == 1) {
        this.userData = res;
        if(this.userData.PermissionName!='View')
          this.service.isAuthor=true;
        this.resultloader=false;
        sessionStorage.setItem('userData', JSON.stringify(this.userData));       
        this.router.navigate(['/dashboard']);      
      }
      else {
        alert('User Name/Password is wrong.')
      }
    }, err => {
      console.log(err);
    })
  }
}
