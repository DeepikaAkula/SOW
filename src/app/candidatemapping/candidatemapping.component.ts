import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CandidateModel } from '../Models/CandidateModel';
import { SOModel } from '../Models/SOModel';
import { StatusModel } from '../Models/StatusModel';
import { CandidateService } from '../services/candidate.service';
import { CandidatemappingService } from '../services/candidatemapping.service';
import { ExcelService } from '../services/excel.service';
import { LoginService } from '../services/login.service';
import { SOWService } from '../services/sow.service';
import { StatusserviceService } from '../services/statusservice.service';

@Component({
  selector: 'app-candidatemapping',
  templateUrl: './candidatemapping.component.html',
  styleUrls: ['./candidatemapping.component.css']
})

export class CandidatemappingComponent implements OnInit {
  rowCount: any;
  batchFilteredRecord: any;
  searchText: any;
  isBatchSearch: boolean;
  isAuthor: boolean = false;
  MappingsList: any = [];
  submitted: boolean = false;
  editmode: boolean = false;
  Id: any = null;
  MappingData: any = [];
  downloadObject: any;
  currentPage: number = 1;
  totalPages: number = 0;
  pageSizeSelected: number = 10;
  batchRecord: any = [];
  resultloader: boolean = false;
  SOData: SOModel[] = [];
  CandidateData: CandidateModel[] = [];
  StatusData: StatusModel[] = [];
  prevSowId: any;
  prevCandidateId: any;
  nextInterval: any;
  previousInterval: any;

  constructor(private service: CandidatemappingService, private candidateService: CandidateService, private sowService: SOWService,
    private statusService: StatusserviceService, private excelService: ExcelService,
    private login: LoginService) {
  }

  async ngOnInit() {
    await this.GetDropdown1();
    await this.GetDropdown2();
    //await this.GetDropdown3();
    this.GetStatusByType();
    this.isAuthor = JSON.parse(sessionStorage.getItem('author'));
    console.log(this.isAuthor)
    this.GetMappingsData();
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

  GetMappingsData() {
    this.resultloader = true;
    this.service.GetAllCandidateMappingData().subscribe(res => {
      this.MappingsList = res;
      this.rowCount = this.MappingsList.length;
      this.MappingData = [];
      this.MappingData = res;
      this.resultloader = false;
      //this.GetSOCandidateDetails();      
      this.totalPages = Math.ceil(this.MappingsList.length / this.pageSizeSelected);
      this.SetDefaultPagination();
    }, err => {
      console.log(err);
    })
    //await this.GetSOCandidateDetails(); 
  }

  GetDropdown1() {
    return new Promise((res, rej) => {
      this.sowService.GetAllSowData().subscribe(data => {
        this.SOData = data;
        res('')
      })
    })
  }

  GetDropdown2() {
    return new Promise((res, rej) => {
      this.candidateService.GetAllCandidatesData().subscribe(data => {
        this.CandidateData = data;
        res('')
      })
    })
  }

  GetDropdown3() {
    return new Promise((res, rej) => {
      this.statusService.GetAllStatusData().subscribe(data => {
        this.StatusData = data;
        res('')
      })
    })
  }

  GetStatusByType() {
    return new Promise((res, rej) => {
      this.statusService.GetStatusByType(0).subscribe(result => {
        this.StatusData = result;
        res('')
      })
    })
  }


  // populateDropdowns() {
  //   this.resultloader = true;
  //   this.sowService.GetAllSowData().subscribe(data => {
  //     this.SOData = data;
  //     console.log(this.SOData)
  //     this.resultloader = false;
  //   })
  //   this.resultloader = true;
  //   this.candidateService.GetAllCandidatesData().subscribe(data => {
  //     this.CandidateData = data;
  //     this.resultloader = false;
  //   })
  //   this.resultloader = true;
  //   this.statusService.GetAllStatusData().subscribe(data => {
  //     this.StatusData = data;
  //     this.resultloader = false;
  //   })
  // }

  mapppingForm = new FormGroup({
    candidateId: new FormControl('', [Validators.required]),
    sowId: new FormControl('', [Validators.required]),
    statusId: new FormControl('', [Validators.required])
  })

  get f() { return this.mapppingForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.mapppingForm.invalid) {
      console.log('invalid');
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
    let formValue = this.mapppingForm.value;
    let checkDuplicate = true;
    if (formValue != null) {
      let sowId = formValue.sowId;
      let candidateId = formValue.candidateId;
      if (isEdit && this.prevSowId == sowId && this.prevCandidateId == candidateId) {
        checkDuplicate = false;
      }

      if (checkDuplicate) {
        var result = this.MappingData.find(item => item.sowId == sowId && item.candidateId == candidateId);
        if (result != null) {
          alert('Duplicate record');
          return true;
        }
      }
    }
    return false;
  }

  onEdit() {
    let formValue = this.mapppingForm.value;
    let obj = {
      soW_CandidateId: this.Id,
      sowId: formValue.sowId,
      candidateId: formValue.candidateId,
      statusId: formValue.statusId,
      type: 'update'
    };
    this.service.UpdateCandidateMappingData(this.Id, obj).subscribe(res => {
      alert('Data updated successfully');
      this.mapppingForm.reset();
      this.GetMappingsData();
      this.editmode = false;
      this.Id = null;
    }, err => {
      console.log(err);
      this.editmode = false;
      this.Id = null
    })
  }

  editDetails(data: any) {
    this.editmode = true;
    this.Id = data.soW_CandidateId;
    this.mapppingForm.patchValue({
      sowId: data.sowId,
      candidateId: data.candidateId,
      statusId: data.statusId,
    })
    this.prevSowId = data.sowId;
    this.prevCandidateId = data.candidateId;
  }

  onAdd() {
    let formValue = this.mapppingForm.value;
    let obj = {
      sowId: formValue.sowId,
      candidateId: formValue.candidateId,
      StatusId: formValue.statusId,
      type: "post",
    };
    this.service.PostCandidateMappingData(obj).subscribe(data => {
      alert("Candidate Added Successfully");
      this.mapppingForm.reset();
      this.GetMappingsData();
    })
  }

  deleteDetails(map: any) {
    this.Id = map.soW_CandidateId;
    var decision = confirm('Are you sure you want to delete?');
    if (decision) {
      this.service.DeleteCandidateMappingData(map.soW_CandidateId).subscribe(res => {
        alert('Data Deleted Successfully');
        this.GetMappingsData();
        this.Id = null;
      })
    }
    else {
      alert('Data not Deleted');
    }
  }

  getSOName(id: any) {
    if (this.SOData != null && id != "") {
      var obj: any;
      this.SOData.find((x: any) => {
        if (x.sowId == id) {
          obj = x;
        }
      })
      return obj.soName;
    }
  }

  getCandidateName(id: any) {
    if (this.CandidateData != null && id != "") {
      var obj: any;
      this.CandidateData.find((x: any) => {
        if (x.candidateId == id) {
          obj = x;
        }
      })
      return obj.candidateName;
    }
  }

  getStatus(id: any) {
    if (this.StatusData != null && id != "") {
      var obj: any;
      this.StatusData.find((x: any) => {
        if (x.statusId == id) {
          obj = x;
        }
      })
      return obj.statusName;
    }
  }

  download() {
    this.downloadObject = this.createObject(this.MappingData)
    let headers = [['SO Candidate Id', 'SO Name', 'Candidate Name', 'Status']]
    this.excelService.jsonExportAsExcel(this.downloadObject, "SOCandidate Mapping", headers);
  }

  createObject(data) {
    return {
      'SOCandidate Mapping Data': data,
    }
  }

  GetSOCandidateDetails() {
    if (this.MappingsList != undefined || this.MappingsList != null) {
      this.MappingData = [];
      this.MappingsList.forEach(element => {
        let obj = {
          soW_CandidateId: element.soW_CandidateId,
          sowName: this.getSOName(element.sowId),
          candidateName: this.getCandidateName(element.candidateId),
          status: this.getStatus(element.statusId)
        }
        this.MappingData.push(obj);
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

    this.batchRecord = this.MappingData.slice(startIndex, endIndex);
  }

  OnNextClicked() {
    let startIndex: number = 0;
    let endIndex: number = 0;
    let indexCounter: number = 0;

    this.currentPage += 1;
    indexCounter = this.currentPage - 1;

    startIndex = indexCounter * Number(this.pageSizeSelected);
    endIndex = Number(this.pageSizeSelected) + startIndex;

    this.batchRecord = this.MappingData.slice(startIndex, endIndex);
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

    this.batchRecord = this.MappingData.slice(startIndex, endIndex);
  }

  SetDefaultPagination() {
    let indexCounter: number = this.currentPage - 1;

    let startIndex: number = indexCounter * Number(this.pageSizeSelected);
    let endIndex: number = Number(this.pageSizeSelected) + startIndex;
    if (this.MappingData) {
      this.batchRecord = this.MappingData.slice(startIndex, endIndex);
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
      this.SetDefaultPaginationForcly(this.MappingData)
    }
    else if (this.searchText != undefined || this.searchText != "") {
      this.isBatchSearch = true;
      this.batchRecord = [];
      this.isBatchSearch = true;
      this.MappingData.forEach(data => {
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
