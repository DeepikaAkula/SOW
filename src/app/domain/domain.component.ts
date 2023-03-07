import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomainService } from '../services/domain.service';
import { ExcelService } from '../services/excel.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.css']
})

export class DomainComponent implements OnInit {
  DomainList: any = [];
  submitted: boolean = false;
  editmode: boolean = false;
  Id: any = null;
  downloadObject: any;
  DomainData: any = [];
  pageSizeSelected: number = 10;
  currentPage: number = 1;
  batchRecord: any = [];
  totalPages: number = 0;
  resultloader: boolean = false;
  isAuthor: boolean = false;
  isBatchSearch: boolean;
  searchText: any;
  batchFilteredRecord: any;
  rowCount: Number;
  prevDomainName: any;

  constructor(private service: DomainService, private excelService: ExcelService, private loginservice: LoginService) {
    //this.isAuthor = this.loginservice.isAuthor;
  }

  ngOnInit(): void {
    this.isAuthor = JSON.parse(sessionStorage.getItem('author'));
    this.GetAllDomainData();
  }

  get f() { return this.domainForm.controls; }

  domainForm = new FormGroup({
    domainName: new FormControl('', [Validators.required])
  })

  GetAllDomainData() {
    this.resultloader = true;
    this.service.GetAllDomainData().subscribe(data => {
      this.DomainList = data;
      this.rowCount = this.DomainList.length;
      this.resultloader = false;
      this.totalPages = Math.ceil(this.DomainList.length / this.pageSizeSelected);
      this.GetDomainDetails();
      this.SetDefaultPagination();
    }, err => {
      console.log(err)
    })
  }

  onSubmit() {
    this.submitted = true;

    if (this.domainForm.invalid) {
      return;
    }

    if (this.editmode) {
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
    let checkDuplicate = true;
    let formValue = this.domainForm.value;
    if (formValue != null) {
      let domainName = formValue.domainName;
      if (isEdit && this.prevDomainName.trim().toLowerCase() === domainName.trim().toLowerCase()) {
        checkDuplicate = false;
      }

      if (checkDuplicate) {
        var result = this.DomainList.find(item => item.domainName.trim().toLowerCase() === domainName.trim().toLowerCase());
        if (result != null) {
          alert('Duplicate record -"' + domainName + '" already exists');
          return true;
        }
      }
    }
    return false;
  }

  onEdit() {
    let formValue = this.domainForm.value;
    let obj = {
      domainId: this.Id,
      domainName: formValue.domainName,
      type: 'update'
    };
    this.service.UpdateDomainData(this.Id, obj).subscribe(res => {
      alert('Data updated successfully');
      this.domainForm.reset();
      this.GetAllDomainData();
      this.editmode = false;
      this.Id = null;
    }, err => {
      ;
      this.editmode = false;
      this.Id = null
    })
  }

  onAdd() {
    let formValue = this.domainForm.value;

    let obj = {
      domainName: formValue.domainName,
      type: "post",
    };
    this.service.PostDomainData(obj).subscribe(data => {
      alert("Domain Added Successfully");
      this.domainForm.reset();
      this.GetAllDomainData();
    })
  }

  editDetails(data: any) {
    this.editmode = true;
    this.Id = data.domainId;
    this.domainForm.patchValue({
      domainName: data.domainName,
    })
    this.prevDomainName = data.domainName;
  }

  download() {
    this.downloadObject = this.createObject(this.DomainData)
    let headers = [['Domain Id', 'Domain Name']]
    this.excelService.jsonExportAsExcel(this.downloadObject, "Domain Details", headers);
  }

  createObject(data) {
    return {
      'Domain Data': data,
    }
  }

  GetDomainDetails() {
    this.DomainList.forEach(element => {
      let obj = {
        domainId: element.domainId,
        domainName: element.domainName,
      }
      this.DomainData.push(obj);
    })
  }

  // deleteDetails(domain:any){
  //   this.Id=domain.domainId;
  //   var decision=confirm('Are you sure you want to delete?');
  //   if(decision){
  //     this.service.DeleteDomainData(domain.domainId).subscribe(res=>{
  //       alert('Domain with domainId '+this.Id+ 'Deleted Successfully');
  //       this.GetAllDomainData();
  //       this.Id=null;
  //     })
  //   }
  //  else{
  //   alert('Domain with domainId ' +this.Id+ ' Not Deleted')
  //  }
  //}

  OnPreviousClicked() {
    let startIndex: number = 0;
    let endIndex: number = 0;
    let indexCounter: number = 0;

    this.currentPage -= 1;
    indexCounter = this.currentPage - 1;

    startIndex = indexCounter * Number(this.pageSizeSelected);
    endIndex = Number(this.pageSizeSelected) + startIndex;

    this.batchRecord = this.DomainList.slice(startIndex, endIndex);
  }

  OnNextClicked() {
    let startIndex: number = 0;
    let endIndex: number = 0;
    let indexCounter: number = 0;

    this.currentPage += 1;
    indexCounter = this.currentPage - 1;

    startIndex = indexCounter * Number(this.pageSizeSelected);
    endIndex = Number(this.pageSizeSelected) + startIndex;

    this.batchRecord = this.DomainList.slice(startIndex, endIndex);
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

    this.batchRecord = this.DomainList.slice(startIndex, endIndex);
  }

  SetDefaultPagination() {
    let indexCounter: number = this.currentPage - 1;
    let startIndex: number = indexCounter * Number(this.pageSizeSelected);
    let endIndex: number = Number(this.pageSizeSelected) + startIndex;
    if (this.DomainList) {
      this.batchRecord = this.DomainList.slice(startIndex, endIndex);
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
      this.SetDefaultPaginationForcly(this.DomainList)
    }
    else if (this.searchText != undefined || this.searchText != "") {
      this.isBatchSearch = true;
      this.batchRecord = [];
      this.isBatchSearch = true;
      this.DomainList.forEach(data => {
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

    // if (this.searchText.trim() == "") {
    //     this.SetDefaultPaginationForcly(this.batchRecord)
    // }
  }
}
