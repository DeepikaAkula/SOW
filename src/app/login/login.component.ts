import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CommonService } from "../common.service";
import { LoginService } from "../services/login.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  submitted: boolean = false;
  userData: any;
  resultloader: boolean = false;
  loaderTimeout: any;
  errorMessage: string;
  showError: boolean = false;
  isAuthor: boolean = false;
  userName: string;

  loginFormForUserName: string;

  loginFormForUserNameCount: string =
    localStorage.getItem("loginFormForUserNameCount") || "0";

  constructor(
    private service: LoginService,
    private router: Router,
    private common: CommonService
  ) {}

  ngOnInit(): void {
    this.userName = this.getUserName();
    this.isAuthor = JSON.parse(sessionStorage.getItem("author"));
  }
  getUserName(): any {
    let data = localStorage.getItem("userData");
    let userInfo = data ? JSON.parse(data) : null;
    return userInfo.LoginName;
  }

  loginForm = new FormGroup({
    emailId: new FormControl("", [Validators.required]),
    loginPassword: new FormControl("", [Validators.required]),
  });

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      alert("Invalid Credentials");
      return;
    } else {
      this.checkUserisValid();

      let count = 0;
      setInterval(() => {
        count++;
        if ((this.resultloader = false)) {
        }
      }, 2000);
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  async checkUserisValid() {
    if (this.loginForm.valid) {
      let formValue = this.loginForm.value;
      let httpParams = new HttpParams()
        .append("EmailId", formValue.emailId)
        .append("loginPassword", formValue.loginPassword);

      // Get the stored username and count from local storage
      let loginFormForUserName = localStorage.getItem("loginFormForUserName");
      let loginFormForUserNameCount =
        parseInt(localStorage.getItem("loginFormForUserNameCount")) || 0;

      // If the stored username matches the entered username, increment the count
      if (loginFormForUserName === formValue.emailId) {
        loginFormForUserNameCount = loginFormForUserNameCount + 1;
      }

      // Storing  the username and count in local storage for locking account

      localStorage.setItem("loginFormForUserName", loginFormForUserName);
      localStorage.setItem(
        "loginFormForUserNameCount",
        loginFormForUserNameCount.toString()
      );

      if (loginFormForUserNameCount === 2) {
        alert(
          "Your Unsuccessful Attempts is 2, if you enter invalid credentials for one more time your account will be locked"
        );
      }

      if (loginFormForUserNameCount >= 3) {
        alert("**your account is locked**");

        localStorage.setItem("loginFormForUserName", loginFormForUserName);
        localStorage.setItem(
          "loginFormForUserNameCount",
          loginFormForUserNameCount.toString()
        );
        return;
      }

      sessionStorage.setItem("loginName", formValue.emailId);
      sessionStorage.setItem("loginPassword", formValue.loginPassword);

      this.loaderTimeout = setTimeout(() => {
        this.resultloader = true;
      }, 1000);

      if (loginFormForUserNameCount <= 2 && loginFormForUserName) {
        try {
          const res = await this.service.GetUserData(httpParams).toPromise();

          clearTimeout(this.loaderTimeout);
          if (res.Status == 1) {
            this.resultloader = false;
            this.userData = res;
            if (this.userData.PermissionName.toLowerCase() == "edit") {
              sessionStorage.setItem("author", "true");
            }
            sessionStorage.setItem("userData", JSON.stringify(this.userData));
            this.loginForm.reset();
            this.router.navigate(["/dashboard"]);
          }
        } catch (err) {
          console.log(err);
          // Clear the timeout when the request is done
          clearTimeout(this.loaderTimeout);
          this.resultloader = true;
          if (err.status === 0) {
            this.router.navigate(["/server-down"]);
            this.showError = true;
          } else {
            this.errorMessage = "Email Id or Password is Incorrect";
          }
        }
      } else {
        alert("**your account is locked");
      }
    }
  }

  justClear() {
    // Get the stored username and count from local storage
    let loginFormForUserName = localStorage.getItem("loginFormForUserName");
    let loginFormForUserNameCount =
      parseInt(localStorage.getItem("loginFormForUserNameCount")) || 0;

    // If the stored username matches the logged in user's username, clear the local storage and reset their count
    if (loginFormForUserName === this.userName) {
      localStorage.removeItem("loginFormForUserName");
      localStorage.removeItem("loginFormForUserNameCount");
      localStorage.setItem("loginFormForUserNameCount", "0");
      alert("cleared");
    }
  }
}
