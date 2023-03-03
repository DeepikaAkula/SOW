import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExcelService } from '../services/excel.service';
import { RegistrationService } from '../services/registration.service';

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

  constructor(private service:RegistrationService,private excelService: ExcelService) { }

  ngOnInit(): void {
    this.isAuthor = JSON.parse(sessionStorage.getItem('author'));
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
      this.onEdit();
    }
    else {
      this.onAdd();
    }
    
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
    let headers = [['SO Candidate Id', 'SO Name', 'Candidate Name', 'Status']]
    this.excelService.jsonExportAsExcel(this.downloadObject, "SOCandidate Mapping", headers);
  }
  createObject(data) {
    return {
      'SOCandidate Mapping Data': data,
    }
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

}
