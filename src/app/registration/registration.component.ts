import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExcelService } from '../services/excel.service';
import { LoginService } from '../services/login.service';
import { RegistrationService } from '../services/registration.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  isAuthor: boolean = false;
  submitted:boolean=false;
  roleName: any[]=[];
  editMode: boolean = false;
  currentPage: number = 1;
  pageSizeSelected: number = 10;
  batchRecord: any = [];
  loginData:any=[];
  totalPages: number = 0;
  rowCount: any;
  batchFilteredRecord: any;
  searchText: any;
  isBatchSearch: boolean;
  downloadObject: any;
  resultloader: boolean = false;
  id: any=null;
  prevUserName: any;
  prevEmailId: any;
  lock: boolean=true;
  nextInterval: any;
  previousInterval: any;

  constructor(private service:RegistrationService,private excelService: ExcelService,private loginService:LoginService) { }

  ngOnInit(): void {
    this.isAuthor = JSON.parse(sessionStorage.getItem('author'));
    console.log(this.isAuthor)
    this.service.GetRoleData().subscribe(result=>{  
      this.roleName=result  
    })
    this.getLoginData();

  }
  getLoginData(){
    this.service.GetLoginData().subscribe(result=>{
      console.log(result);
      this.loginData=result;
      this.rowCount = this.loginData.length;
      this.resultloader = false; 
      this.totalPages = Math.ceil(this.loginData.length / this.pageSizeSelected);
      this.SetDefaultPagination();
    }, err => {
      console.log(err);
    })
  }
  regForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    emailId: new FormControl('', [Validators.required,Validators.email]),
    role:new FormControl('',[Validators.required]),
  })
  get f() { return this.regForm.controls; }
  onSubmit(){
    
    this.submitted = true;
    if (this.regForm.invalid) {
      return;
    }

    if (this.editMode) {
      if (!this.isDuplicate(true)) {
        this.onEdit();
      }
    }
    else {
      if (!this.isDuplicate(false)) {
        this.onAdd();
      }
    }
    
  }
  isDuplicate(isEdit: boolean) {
    debugger;
    let checkDuplicate = true;
    let checkDuplicateEmail=false;
    let formValue = this.regForm.value;
    if (formValue != null) {
      let userName = formValue.userName
      let emailId = formValue.emailId
      if (isEdit && this.prevUserName.trim().toLowerCase() === userName.trim().toLowerCase()) {
        checkDuplicate = false;
      }
      if(isEdit && this.prevEmailId.trim().toLocaleLowerCase()!=emailId.trim().toLocaleLowerCase()){
        checkDuplicateEmail = true;
      }

      if (checkDuplicate) {
        var userNameExist = this.loginData.find(item => ((item.loginName).toLocaleLowerCase()).trim() ==userName.trim());
        if (userNameExist != null) {
          alert('Duplicate record -"' + userName + '" already exists');
          return true;
        }
        var emailExist=this.loginData.find(item=>((item.emailId).toLocaleLowerCase()).trim() == emailId.trim());
        if(emailExist !=null){
          alert('Duplicate record -"' + emailId + '" already exists');
          return true;
        }
        
      }
      if (checkDuplicateEmail) {
        var emailExist=this.loginData.find(item=>((item.emailId).toLocaleLowerCase()).trim() == emailId.trim());
        if(emailExist !=null){
          alert('Duplicate record -"' + emailId + '" already exists');
          return true;
        }
        
      }
    }
    return false;
  }
  onEdit(){
    let formValue = this.regForm.value;
    let obj = {
      loginId: this.id,
      loginName:formValue.userName,
      emailId: formValue.emailId,
      roleId: formValue.role,
      type: 'update'
    };
    console.log(obj);
    this.service.UpdateLoginData(this.id, obj).subscribe(res => {
      alert('Data updated successfully');
      this.regForm.reset();
      this.getLoginData();
      this.editMode = false;
      this.id = null;
    }, err => {
      console.log(err);
      this.editMode = false;
      this.id = null
    })

  }
  onAdd(){
    let formValue = this.regForm.value;
    
    let obj = {
      loginName: formValue.userName,
      emailId: formValue.emailId,
      roleId: formValue.role,
      type: "post",
    };
    this.service.PostRegistrationData(obj).subscribe(data => {
      alert("Candidate Added Successfully");
      this.regForm.reset();
      this.getLoginData();
    })

  }
  editDetails(data: any) {
    console.log(data.roleId);
    this.editMode = true;
    this.id = data.loginId;
    this.regForm.patchValue({
      userName: data.loginName,
      emailId: data.emailId,
      role: data.roleId
    })
    this.prevUserName=data.loginName;
    this.prevEmailId=data.emailId
  }
  deleteDetails(data: any) {
    this.id = data.loginId;
    var decision = confirm('Are you sure you want to delete?');
    if (decision) {
      this.service.DeleteLoginData(data.loginId).subscribe(res => {
        alert('Data Deleted Successfully');
        this.getLoginData();
        this.id = null;
      })
    }
    else {
      alert('Data not Deleted');
    }
  }
  download() {
    this.downloadObject = this.createObject(this.loginData)
    let headers = [['Login Name','Login Password','Login Id', 'Email Id','Role Id', 'Role Name']]
    this.excelService.jsonExportAsExcel(this.downloadObject, "Login Data", headers);
  }
  createObject(data) {
    return {
      'SOCandidate Mapping Data': data,
    }
  }
  OnNextHeld() {
    this.nextInterval = setInterval(() => {
      if (this.currentPage < this.totalPages) {
        this.OnNextClicked();
      } else {
        clearInterval(this.nextInterval);
      }
    }, 200);
  }
  
  OnNextReleased() {
    clearInterval(this.nextInterval);
  }
  
  OnPreviousHeld() {
    this.previousInterval = setInterval(() => {
      if (this.currentPage > 1) {
        this.OnPreviousClicked();
      } else {
        clearInterval(this.previousInterval);
      }
    }, 200);
  }
  
  OnPreviousReleased() {
    clearInterval(this.previousInterval);
  }
  OnPreviousClicked() {
    let startIndex: number = 0;
    let endIndex: number = 0;
    let indexCounter: number = 0;

    this.currentPage -= 1;
    indexCounter = this.currentPage - 1;

    startIndex = indexCounter * Number(this.pageSizeSelected);
    endIndex = Number(this.pageSizeSelected) + startIndex;

    this.batchRecord = this.loginData.slice(startIndex, endIndex);
  }

  OnNextClicked() {
    let startIndex: number = 0;
    let endIndex: number = 0;
    let indexCounter: number = 0;

    this.currentPage += 1;
    indexCounter = this.currentPage - 1;

    startIndex = indexCounter * Number(this.pageSizeSelected);
    endIndex = Number(this.pageSizeSelected) + startIndex;

    this.batchRecord = this.loginData.slice(startIndex, endIndex);
  }

  OnPageNumberChanged(event: any) {
    let startIndex: number = 0;
    let endIndex: number = 0;
    let indexCounter: number = 0;
    let pageNumber = Math.floor(Number(event.target.value));

    if (pageNumber == 0 || pageNumber > this.totalPages) {
      this.currentPage = 1;
      event.target.value = this.currentPage;
      startIndex = 0;
    } else {
      indexCounter = pageNumber - 1;
      this.currentPage = pageNumber;
      event.target.value = pageNumber;
      startIndex = indexCounter * Number(this.pageSizeSelected);
    }
    endIndex = Number(this.pageSizeSelected) + startIndex;

    this.batchRecord = this.loginData.slice(startIndex, endIndex);
  }

  SetDefaultPagination() {
    let indexCounter: number = this.currentPage - 1;

    let startIndex: number = indexCounter * Number(this.pageSizeSelected);
    let endIndex: number = Number(this.pageSizeSelected) + startIndex;
    if (this.loginData) {
      this.batchRecord = this.loginData.slice(startIndex, endIndex);
    }
  }
  SetDefaultPaginationForcly(data: any) {
    this.batchFilteredRecord = data;
    let indexCounter: number = this.currentPage - 1;

    let startIndex: number = indexCounter * Number(this.pageSizeSelected);
    let endIndex: number = Number(this.pageSizeSelected) + startIndex;
    if (this.batchFilteredRecord) {
      this.batchRecord = this.batchFilteredRecord.slice(startIndex, endIndex);
    }
  }

  searchFilter() {
    if (this.searchText.trim() == "") {
      this.SetDefaultPaginationForcly(this.loginData)
    }
    else if (this.searchText != undefined || this.searchText != "") {
      this.isBatchSearch = true;
      this.batchRecord = [];
      this.isBatchSearch = true;
      this.loginData.forEach(data => {
        for (let t of Object.keys(data)) {
          if (!(data[t] == null || data[t] == undefined)) {
            if (data[t].toString().toLowerCase().includes(this.searchText.toLowerCase())) {
              this.batchRecord.push(data);

              break;
            }
          }
        }
        this.SetDefaultPaginationForcly(this.batchRecord)
      });
    } else {
      this.batchRecord = [];
      this.isBatchSearch = false;
    }
  }
  lockAccount(){
    this.lock=false;
  }
resetAccount(){
  console.log("reset");
  let obj = {
    FailureAttempts:0
  };
  var loginName=sessionStorage.getItem("loginName");
  var loginPassword=sessionStorage.getItem("loginPassword")
  //let httpParams = new HttpParams().append("loginName",loginName).append("loginPassword",loginPassword);
  this.loginService.PutUserData(loginName,loginPassword,obj).subscribe(result=>{
    alert("Reset Successfully!");

  })
}
}
