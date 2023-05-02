import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TechnologyModel } from '../Models/TechnologyModel';
import { DomainService } from '../services/domain.service';
import { ExcelService } from '../services/excel.service';
import { LoginService } from '../services/login.service';
import { TechnologyService } from '../services/technology.service';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.css']
})

export class TechnologyComponent implements OnInit {
  TechList: TechnologyModel[] = [];
  submitted: boolean = false;
  editmode: boolean = false;
  Id: any = null;
  DomainList: any = [];
  TechData: any = [];
  downloadObject: any;
  batchRecord: any = [];
  pageSizeSelected: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  isAuthor: boolean = false;
  searchText: any;
  isBatchSearch: boolean;
  batchFilteredRecord: any;
  rowCount: Number;
  prevTechnologyName: any;
  prevDomainId: any;
  timer:any
  nextInterval: any;
  previousInterval: any;
  maxCountError:string;
  minCountError:string;

  constructor(private service: TechnologyService, private domainService: DomainService, private excelService: ExcelService, private login: LoginService) {
  }

  async ngOnInit() {
    this.isAuthor = JSON.parse(sessionStorage.getItem('author'));
    await this.populateDropdowns();
    this.GetAllTechData();
    this.timer = null;
  }

  techForm = new FormGroup({
    technologyName: new FormControl('', [Validators.required]),
    domainId: new FormControl('', [Validators.required])
  })
  get f() { return this.techForm.controls; }

  GetAllTechData() {
    this.service.GetAllTechData().subscribe(data => {
      this.TechList = data;
      this.TechData = data;
      console.log(data);
      this.rowCount = this.TechList.length;
      //this.GetTechDetails();
      this.totalPages = Math.ceil(this.TechList.length / this.pageSizeSelected)
      this.SetDefaultPagination();
    }, err => {
      console.log(err)
    })
  }

  populateDropdowns() {
    return new Promise((res, rej) => {
      this.domainService.GetAllDomainData().subscribe(data => {
        this.DomainList = data;
        res('')
      })
    })
  }

  onSubmit() {
    this.submitted = true;

    if (this.techForm.invalid) {
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
  



  isDuplicate(isEdit: boolean) {
    let checkDuplicate = true;
    let formValue = this.techForm.value;
    if (formValue != null) {
      let technologyName = formValue.technologyName;
      let domainId = formValue.domainId;

      if (isEdit && this.prevTechnologyName.trim().toLowerCase() === technologyName.trim().toLowerCase()
        && this.prevDomainId == domainId) {
        checkDuplicate = false;
      }

      if (checkDuplicate) {
        var result = this.TechList.find(item => item.technologyName.trim().toLowerCase() === technologyName.trim().toLowerCase()
          && item.domainId.toString() === domainId);
        if (result != null) {
          alert('Duplicate record');
          return true;
        }
      }
    }
    return false;
  }

  onEdit() {
    let formValue = this.techForm.value;
    let obj = {
      technologyId: this.Id,
      technologyName: formValue.technologyName,
      domainId: formValue.domainId,
      type: 'update'
    };
    this.service.UpdateTechData(this.Id, obj).subscribe(res => {
      alert('Data updated successfully');
      this.techForm.reset();
      this.GetAllTechData();
      this.editmode = false;
      this.Id = null;
    }, err => {
      console.log(err);
      this.editmode = false;
      this.Id = null
    })
  }

  onAdd() {
    let formValue = this.techForm.value;
    let obj = {
      technologyName: formValue.technologyName,
      domainId: formValue.domainId,
      type: "post",
    };
    this.service.PostTechData(obj).subscribe(data => {
      alert("Technology Added Successfully");
      this.techForm.reset();
      this.GetAllTechData();
    })
  }

  editDetails(data: any) {
    this.editmode = true;
    console.log(data);
    this.Id = data.technologyId;
    this.techForm.patchValue({
      technologyName: data.technologyName,
      domainId: data.domainId,
    })
    this.prevDomainId = data.domainId;
    this.prevTechnologyName = data.technologyName;
    console.log(data.domainId);
  }

  getDomainName(id: any) {
    if (this.DomainList && id != "") {
      var obj: any;
      this.DomainList.find((x: any) => {
        if (x.domainId == id) {
          obj = x;
        }
      })
      return obj.domainName;
    }
  }

  // deleteDetails(tech:any){
  //   this.Id=tech.technologyId;
  //   var decision=confirm('Are you sure you want to delete?');
  //   if(decision){
  //     this.service.DeleteTechData(tech.technologyId).subscribe(res=>{
  //       alert('Technology with TechnologyId '+this.Id+ 'Deleted Successfully');
  //       this.GetAllTechData();
  //       this.Id=null;
  //     },err=>{
  //       alert(err);
  //     })
  //   }
  //  else{
  //   alert('Technology with TechnologyId ' +this.Id+ ' Not Deleted')
  //  }
  // }

  download() {
    this.downloadObject = this.createObject(this.TechData)
    let headers = [['Technology Id', 'Technology Name', 'Domain Name']]
    this.excelService.jsonExportAsExcel(this.downloadObject, "Technology Details", headers);
  }

  createObject(data) {
    return {
      'Technology Data': data,
    }
  }

  GetTechDetails() {
    if (this.TechList != undefined || this.TechList != null) {
      this.TechData = [];
      this.TechList.forEach(element => {
        let obj = {
          technologyId: element.technologyId,
          technologyName: element.technologyName,
          domainName: this.getDomainName(element.domainId)
        }
        this.TechData.push(obj);
      })
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

    this.batchRecord = this.TechData.slice(startIndex, endIndex);
  }

  OnNextClicked() {
    let startIndex: number = 0;
    let endIndex: number = 0;
    let indexCounter: number = 0;

    this.currentPage += 1;
    indexCounter = this.currentPage - 1;

    startIndex = indexCounter * Number(this.pageSizeSelected);
    endIndex = Number(this.pageSizeSelected) + startIndex;

    this.batchRecord = this.TechData.slice(startIndex, endIndex);
    
  
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

    this.batchRecord = this.TechData.slice(startIndex, endIndex);
  }

  SetDefaultPagination() {
    let indexCounter: number = this.currentPage - 1;
    let startIndex: number = indexCounter * Number(this.pageSizeSelected);
    let endIndex: number = Number(this.pageSizeSelected) + startIndex;
    if (this.TechData) {
      this.batchRecord = this.TechData.slice(startIndex, endIndex);
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
      this.SetDefaultPaginationForcly(this.TechData)
    }
    else if (this.searchText != undefined || this.searchText != "") {
      this.isBatchSearch = true;
      this.batchRecord = [];
      this.isBatchSearch = true;

      this.TechData.forEach(data => {
        for (let t of Object.keys(data)) {
          console.log(t)
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
