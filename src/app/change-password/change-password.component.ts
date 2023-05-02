import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangePasswordService } from '../services/change-password.service';
import { sequenceEqual } from 'rxjs';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  submitted=false;
  isAuthor:boolean=false;
   passwordsMatch = true; 
   passwordMatchError:string;
   oldPasswordMatchWithNew=true;
   oldPasswordMatchWithNewError:string;
   userName:string;
   errorMessage:string;
   oldPasswordIsWrong:string;
   updatedSuccessfully:string;
   updatedSuccessfullyCounts: number[] = [];
   oldPasswordIsWrongCounts:number[]=[];
   passwordUpdated=false;
    prevUpdatedSuccessfullyCount: number = 0;
   prevOldPasswordIsWrongCount: number = 0;


  constructor(private service:ChangePasswordService,private router:Router) { }

  ngOnInit(): void {
    this.userName = this.getUserName();
    this.isAuthor = JSON.parse(sessionStorage.getItem('author'));
  }
  passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+~`|}{[\]:;?><,./-]).{6,}$/
 

  // here the passwordPattern taken as 1./ is the begining of the string 2.(?=.*[ ]) is the assertion of the string pattern similarly rest of the pattern follows
  //3. .{6,} takes minimum length of the complete string and after , we can add maxlength

  passwordForm = new FormGroup({
    oldPw: new FormControl('', [Validators.required]),
    newPw: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
    confirmPw: new FormControl('', [Validators.required]),
    userName: new FormControl('', [Validators.required])
  
  })
  getUserName(): any {
    let data = sessionStorage.getItem('userData');
    let userInfo = (data) ? JSON.parse(data) : null;
    return userInfo.LoginName;
  }
  
  get f() { return this.passwordForm.controls; }
  onSubmit(){
    
    this.submitted = true;
   
    this.passwordsMatch = this.f.newPw.value === this.f.confirmPw.value; 
    this.oldPasswordMatchWithNew=this.f.oldPw.value!==this.f.newPw.value

    if (this.passwordForm.invalid) 
    { 
      console.log("form is invalid")
      return;
      
    }else{
      this.onAdd();
    }
    
    }

    onAdd() {
      let formValue = this.passwordForm.value;
      let obj = {
        loginName: formValue.userName,
        oldPassword: formValue.oldPw,
        newPassword: formValue.newPw,
        type: "post",
      };
    
      if (!this.passwordsMatch) {
        console.log("password does not match");
        this.passwordMatchError = " **Confirm Password does not match with the New Password";
        return;
      }
    
      if (!this.oldPasswordMatchWithNew) {
        console.log("old and new passwords are matched");
        this.oldPasswordMatchWithNewError = "**Old Password and New Password should not be the same";
        return;
      }
    
      if (this.passwordForm.valid) {
        this.service.UpdatePasswordData(obj).subscribe(
          (response) => {
            if (response.count1 === 1) {
              console.log('updated successfully');
              alert("Your Password is updated Successfully");
              this.updatedSuccessfully = "Your Password is updated Successfully"
              this.updatedSuccessfullyCounts.push(1);
              console.log("update count", this.updatedSuccessfullyCounts)
              this.passwordForm.reset();
              this.passwordUpdated = true; 
              this.oldPasswordIsWrongCounts = [];
              // clearing the oldPasswordIsWrongCounts when this ..
              //..conditon is satified means that when it is updated,this is done because to when password is updated making the olderrors to zero
            }
            if (response.count2 === 2) {
              this.oldPasswordIsWrong="You Have Entered the Wrong Password";
              this.oldPasswordIsWrongCounts.push(1);
              console.error('Old password does not match');
              console.log("oldpasswordwrongcount",this.oldPasswordIsWrongCounts)
              //alert('You Have Entered the Wrong Password');
            }
          },
          (error) => {
            console.log('Error:', error);
          }
        );
      } else {
        this.errorMessage = "Invalid Credentials";
        alert(this.errorMessage);
      }
    }       
}
