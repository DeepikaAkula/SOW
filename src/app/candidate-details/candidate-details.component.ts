import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService } from '../services/candidate.service';
import { CandidatemappingService } from '../services/candidatemapping.service';
import { ExcelService } from '../services/excel.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css']
})

export class CandidateDetailsComponent implements OnInit {
  
  CandidateList: any = [];
  model: any = {};
  submitted: boolean = false;
  editmode: boolean = false;
  Id: any;
  mappinglst: any = [];
  downloadObject: any;
  totalPages: number = 0;
  currentPage: number = 1;
  pageSizeSelected: number = 10;
  batchRecord: any = [];
  resultloader: boolean = false;
  isAuthor: boolean = false;
  candidate: any;
  searchText: any;
  isBatchSearch: boolean;
  batchFilteredRecord: any;
  rowCount: any;
  fromDate: string;
  endDate: string;
  startDate:string;
  nextInterval: any;
  previousInterval: any;

  constructor(private service: CandidateService,
    private mappingService: CandidatemappingService,
    private excelService: ExcelService,
    public formBuilder: FormBuilder,
    private login: LoginService,
    private router: Router) {
  }

  candidateform = new FormGroup({
    candidateName: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    mobileNo: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"),
    Validators.minLength(10), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    gender: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    joiningDate: new FormControl('', Validators.required),
    skills: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    pincode: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("[0-9]")]),
    isInternal: new FormControl(),
  })

  ngOnInit(): void {
    this.isAuthor = JSON.parse(sessionStorage.getItem('author'));
    this.GetCandidateData();
  }

  get f() { return this.candidateform.controls; }
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
  GetCandidateData() {
    this.resultloader = true;
    this.mappingService.GetAllCandidateMappingData().subscribe(res => {
      this.mappinglst = res;
      this.resultloader = false;
      console.log('mappinglst');
      console.log(this.mappinglst);
    },
      err => console.log(err));
    this.resultloader = true;
    this.service.GetAllCandidatesData().subscribe(data => {
      this.CandidateList = data;
      console.log('CandidateList');
      console.log(this.CandidateList);
      this.rowCount = this.CandidateList.length;
      this.resultloader = false;
      this.totalPages = Math.ceil(this.CandidateList.length / this.pageSizeSelected);
      this.SetDefaultPagination();

    }, err => {
      console.log(err)
    })
  }

  onSubmit() {
    this.submitted = true;
    if (this.candidateform.invalid) {
      return;
    }
    if (this.editmode) {
      this.onEdit();
    }
    else {
      this.onAdd();
    }
  }

  onEdit() {
    let formValue = this.candidateform.value;
    let obj = {
      candidateId: this.Id,
      candidateName: formValue.candidateName,
      dob: formValue.dob,
      address: formValue.address,
      gender: formValue.gender,
      location: formValue.location,
      joiningDate: formValue.joiningDate,
      mobileNo: formValue.mobileNo,
      skills: formValue.skills,
      email: formValue.email,
      status: formValue.status,
      pincode: formValue.pincode,
      isInternal: formValue.isInternal,
    };
    this.service.UpdateCandidateData(this.Id, obj).subscribe(res => {
      alert('Data updated successfully');
      this.candidateform.reset();
      this.GetCandidateData();
      this.editmode = false;
      this.Id = null;
    }, err => {
      console.log(err);
      this.editmode = false;
      this.Id = null
    })
  }

  onAdd() {
    let obj = this.candidateform.value;
    obj.isInternal = (obj.isInternal != true) ? false : true;
    this.service.PostCandidateData(obj).subscribe(data => {
      alert("Candidate Added Successfully");
      this.candidateform.reset();
      this.GetCandidateData();
    })
  }

  editDetails(candidate: any) {
    this.candidate = candidate.candidateId
    this.editmode = true;
    this.router.navigate(['/candidateList'], { queryParams: { editMode: this.editmode, myArray: this.candidate } });
    // this.Id = candidate.candidateId;
    // candidate.dob = this.dateTrim(candidate.dob);
    // candidate.joiningDate = this.dateTrim(candidate.joiningDate);
    // this.candidateform.patchValue({
    //   candidateName: candidate.candidateName,
    //   dob: candidate.dob,
    //   address: candidate.address,
    //   email: candidate.email,
    //   gender: candidate.gender,
    //   joiningDate: candidate.joiningDate,
    //   location: candidate.location,
    //   mobileNo: candidate.mobileNo,
    //   pincode: candidate.pincode,
    //   skills: candidate.skills,
    //   status: candidate.status,
    //   isInternal: candidate.isInternal
    //})
  }

  deleteDetails(candidate: any) {
    var obj = null;
    this.Id = candidate.candidateId;
    var decision = confirm('Are you sure you want to delete?');
    if (decision) {
      this.mappinglst.find((x: any) => {
        if (x.candidateId == this.Id) {
          obj = x;
        }
      })
      if (obj == null) {
        this.service.DeleteCandidateData(candidate.candidateId).subscribe(res => {
          alert('Candidate with CandidateId ' + this.Id + 'Deleted Successfully');
          this.GetCandidateData();
          this.Id = null;
        })
      }
      else {
        alert('Mapping Exists for this candidate with SO.' + '\n' + 'Please unmap and then delete');
      }
    }
    else {
      alert('Candidate with CandidateId ' + this.Id + ' Not Deleted')
    }
  }

  dateTrim(data: any) {
    let datearr = data.split("T")
    return datearr[0];
  }

  // download() {
  //   this.downloadObject = this.createObject(this.CandidateList)
  //   let headers = [['Candidate Id', 'Candidate Name', 'Mobile No', 'Gender', 'DOB', 'Email', 'Location', 'Skills', 'Joining Date', 'Address',
  //     'Status', 'Pincode', 'isInternal']]
  //   this.excelService.jsonExportAsExcel(this.downloadObject, "Candidate Details", headers);
  // }
  download() {
    // let downloadList:CandidateModel[]=this.CandidateList.filter( x=> this.compareFromDates(x.joiningDate,this.fromDate) && this.compareToDates(x.joiningDate,this.endDate));
    this.fromDate = new DatePipe('en-US').transform(this.fromDate, 'yyyy-MM-dd');
    this.endDate = new DatePipe('en-US').transform(this.endDate, 'yyyy-MM-dd');
    console.log(this.fromDate+'  '+this.endDate)
    this.service.GetCandidateByDate(this.fromDate,this.endDate).subscribe((data)=>{
      if(data!=null || data!=undefined){
        console.log(data)
        this.downloadObject = this.createObject(data)
        let headers = [['Candidate Id', 'Candidate Name', 'Mobile No', 'Gender', 'DOB', 'Email', 'Location', 'Skills', 'Joining Date', 'Address',
          'Status', 'Pincode', 'isInternal']]
        this.excelService.jsonExportAsExcel(this.downloadObject, "Candidate Details", headers);
      }
      else
        alert('No Records found!')
    })
   
  }

  createObject(data) {
    return {
      'Candidate Data': data,
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

    this.batchRecord = this.CandidateList.slice(startIndex, endIndex);
  }

  OnNextClicked() {
    let startIndex: number = 0;
    let endIndex: number = 0;
    let indexCounter: number = 0;

    this.currentPage += 1;
    indexCounter = this.currentPage - 1;

    startIndex = indexCounter * Number(this.pageSizeSelected);
    endIndex = Number(this.pageSizeSelected) + startIndex;

    this.batchRecord = this.CandidateList.slice(startIndex, endIndex);
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

    this.batchRecord = this.CandidateList.slice(startIndex, endIndex);
  }

  SetDefaultPagination() {
    let indexCounter: number = this.currentPage - 1;

    let startIndex: number = indexCounter * Number(this.pageSizeSelected);
    let endIndex: number = Number(this.pageSizeSelected) + startIndex;
    if (this.CandidateList) {
      this.batchRecord = this.CandidateList.slice(startIndex, endIndex);
    }
  }

  searchFilter() {
    if (this.searchText.trim() == "") {
      this.SetDefaultPaginationForcly(this.CandidateList)
    }
    else if (this.searchText != undefined || this.searchText != "") {
      this.isBatchSearch = true;
      this.batchRecord = [];
      this.isBatchSearch = true;
      this.CandidateList.forEach(data => {
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
    this.SetDefaultPaginationForcly(this.batchRecord)
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
}
