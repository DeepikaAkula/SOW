import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangePasswordService } from '../services/change-password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  submitted=false;
  isAuthor:boolean=false;

  constructor(private service:ChangePasswordService) { }

  ngOnInit(): void {
    this.isAuthor = JSON.parse(sessionStorage.getItem('author'));
  }
  passwordForm = new FormGroup({
    oldPw: new FormControl('', [Validators.required]),
    newPw: new FormControl('', [Validators.required]),
    confirmPw:new FormControl('',[Validators.required]),
    userName:new FormControl('',[Validators.required])
  })
  get f() { return this.passwordForm.controls; }
  debugger;
  onSubmit(){
    
    this.submitted = true;

    if (this.passwordForm.invalid) {
      console.log("submit")
      return;
      
    }
    this.onAdd();
    }

  onAdd(){
    let formValue = this.passwordForm.value;

    let obj = {
      loginName:formValue.userName,
      oldPassword:formValue.oldPw,
      newPassword:formValue.newPw,
      type: "post",
    };
    this.service.UpdatePasswordData(obj).subscribe(data => {
      alert("Domain Added Successfully");
      this.passwordForm.reset();
      
    })
  }

}
