import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountModel } from '../Models/AccountModel';
import { DellManagerModel } from '../Models/DellManagerModel';
import { LocationModel } from '../Models/LocationModel';
import { MappingModel } from '../Models/MappingModel';
import { RecruiterModel } from '../Models/RecruiterModel';
import { RegionModel } from '../Models/RegionModel';
import { SOModel } from '../Models/SOModel';
import { StatusModel } from '../Models/StatusModel';
import { TechnologyModel } from '../Models/TechnologyModel';
import { USTPOCModel } from '../Models/USTPOCModel';
import { USTTPMModel } from '../Models/USTTPMModel';
import { AccountserviceService } from '../services/accountservice.service';
import { CandidatemappingService } from '../services/candidatemapping.service';
import { DellmanagerserviceService } from '../services/dellmanagerservice.service';
import { ExcelService } from '../services/excel.service';
import { LocationserviceService } from '../services/locationservice.service';
import { LoginService } from '../services/login.service';
import { RecruiterserviceService } from '../services/recruiterservice.service';
import { RegionserviceService } from '../services/regionservice.service';
import { SOWService } from '../services/sow.service';
import { StatusserviceService } from '../services/statusservice.service';
import { TechnologyService } from '../services/technology.service';
import { UstpocserviceService } from '../services/ustpocservice.service';
import { UsttpmserviceService } from '../services/usttpmservice.service';

@Component({
  selector: 'app-sow',
  templateUrl: './sow.component.html',
  styleUrls: ['./sow.component.css']
})

export class SOWComponent implements OnInit {
  SowList: SOModel[] = []
  submitted: boolean = false;
  editmode: boolean = false;
  Id: any = null;
  regionList: RegionModel[] = [];
  accountList: AccountModel[] = [];
  technologyList: TechnologyModel[] = [];
  locationList: LocationModel[] = [];
  ustPocList: USTPOCModel[] = [];
  ustTpmList: USTTPMModel[] = [];
  recruiterList: RecruiterModel[] = [];
  dellManagerList: DellManagerModel[] = [];
  statusList: StatusModel[] = [];
  mappinglst: MappingModel[] = [];
  downloadObject: any;
  SOData: any = [];
  pageSizeSelected: number = 10;
  batchRecord: any = [];
  currentPage: number = 1;
  totalPages: number = 0;
  resultloader: boolean = false;
  isAuthor: boolean = false;
  rowCount: number;
  isBatchSearch: boolean;
  searchText: any;
  batchFilteredRecord: any;
  isChecked: boolean = false;
  @Output() eventChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  fromDate: string | number | Date;
  endDate: string | number | Date;
  startDate:string;
  nextInterval: any;
  previousInterval: any;

  constructor(private service: SOWService, private regionService: RegionserviceService, private locationService: LocationserviceService,
    private accountService: AccountserviceService, private tpmService: UsttpmserviceService, private pocService: UstpocserviceService, private recruiterService: RecruiterserviceService,
    private dellManagerService: DellmanagerserviceService, private statusService: StatusserviceService, private techService: TechnologyService,
    private mappingService: CandidatemappingService, private excelService: ExcelService, private login: LoginService, private router: Router) {
  }

  async ngOnInit() {
    this.isAuthor = JSON.parse(sessionStorage.getItem('author'));
    // await this.GetDropdown1();
    // await this.GetDropdown2();
    // await this.GetDropdown3();
    // await this.GetDropdown4();
    // await this.GetDropdown5();
    // await this.GetDropdown6();
    // await this.GetDropdown7();
    // await this.GetDropdown8();
    // await this.GetDropdown9();
    // await this.GetDropdown10();
    this.GetSowData();
   
  }

  SowForm = new FormGroup({
    soName: new FormControl('', [Validators.required]),
    jrCode: new FormControl('', [Validators.required]),
    requestCreationDate: new FormControl('', [Validators.required]),
    accountId: new FormControl('', [Validators.required]),
    technologyId: new FormControl('', [Validators.required]),
    regionId: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
    locationId: new FormControl('', [Validators.required]),
    targetOpenPositions: new FormControl('', [Validators.required]),
    positionsTobeClosed: new FormControl('', [Validators.required]),
    ustpocId: new FormControl('', [Validators.required]),
    recruiterId: new FormControl('', [Validators.required]),
    usttpmId: new FormControl('', [Validators.required]),
    dellManagerId: new FormControl('', [Validators.required]),
    statusId: new FormControl('', [Validators.required]),
    band: new FormControl('', [Validators.required]),
    projectId: new FormControl('', [Validators.required]),
    accountManager: new FormControl('', [Validators.required]),
    externalResource: new FormControl(),
    internalResource: new FormControl()
  })

  get f() { return this.SowForm.controls; }
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


  GetSowData() {
    this.resultloader = true;
    this.service.GetAllSowData().subscribe(res => {
      this.SowList = res;
      this.rowCount = this.SowList.length;
      this.SOData = [];
      this.SOData = res
      console.log(this.SOData)
      //  this.GetSODetails();      
      this.resultloader = false;
      this.totalPages = Math.ceil(this.SowList.length / this.pageSizeSelected);
      this.SetDefaultPagination();
    }, err => {
      console.log(err);
    })
  }

  GetDropdown1() {
    return new Promise((res, rej) => {
      this.accountService.GetAllAccountData().subscribe(result => {
        this.accountList = result;
        res('')
      })
    })
  }

  GetDropdown2() {
    return new Promise((res, rej) => {
      this.techService.GetAllTechData().subscribe(result => {
        this.technologyList = result;
        res('')
      })
    })
  }

  GetDropdown3() {
    return new Promise((res, rej) => {
      this.recruiterService.GetAllRecruiterData().subscribe(result => {
        this.recruiterList = result;
        res('');
      })
    })
  }

  GetDropdown4() {
    return new Promise((res, rej) => {
      this.pocService.GetAllUstPocData().subscribe(result => {
        this.ustPocList = result;
        res('')
      })
    })
  }

  GetDropdown5() {
    return new Promise((res, rej) => {
      this.dellManagerService.GetAllDellManagerData().subscribe(result => {
        this.dellManagerList = result;
        res('')
      })
    })
  }

  GetDropdown6() {
    return new Promise((res, rej) => {
      this.statusService.GetAllStatusData().subscribe(result => {
        this.statusList = result;
        res('')
      })
    })
  }

  GetDropdown7() {
    return new Promise((res, rej) => {
      this.regionService.GetAllRegionData().subscribe(result => {
        this.regionList = result;
        res('')
      })
    })
  }

  GetDropdown8() {
    return new Promise((res, rej) => {
      this.tpmService.GetAllUSTTPMData().subscribe(result => {
        this.ustTpmList = result;
        res('')
      })
    })
  }

  GetDropdown9() {
    return new Promise((res, rej) => {
      this.locationService.GetAllLocationData().subscribe(result => {
        this.locationList = result;
        res('')
      })
    })
  }

  GetDropdown10() {
    return new Promise((res, rej) => {
      this.mappingService.GetAllCandidateMappingData().subscribe((result) => {
        this.mappinglst = result;
        res('')
      })
    })
  }

  Add() {
    this.router.navigate(["/soList"]);
  }
  // async populateDropdowns() {
  //   this.technologyList = [];
  //   this.accountList = [];
  //   this.resultloader = true;
  //   await this.techService.GetAllTechData().subscribe(res => {
  //     this.technologyList = res;
  //     this.resultloader = false;
  //   }, err => {
  //     console.log(err);
  //   })
  //   this.resultloader = true;
  //   await this.accountService.GetAllAccountData().subscribe(res => {
  //     this.accountList = res;
  //     this.resultloader = false;
  //   }, err => {
  //     console.log(err);
  //   })
  //   this.resultloader = true;
  //   await this.recruiterService.GetAllRecruiterData().subscribe(res => {
  //     this.recruiterList = res;
  //     this.resultloader = false;
  //   }, err => {
  //     console.log(err);
  //   })
  //   this.resultloader = true;
  //   await this.pocService.GetAllUstPocData().subscribe(res => {
  //     if (res && res.length > 0) {
  //       this.ustPocList = res;
  //       this.resultloader = false;
  //     }
  //     else {
  //       this.ustPocList = [];
  //     }
  //   }, err => {
  //     console.log(err);
  //   })
  //   this.resultloader = true;
  //   await this.dellManagerService.GetAllDellManagerData().subscribe(res => {
  //     this.dellManagerList = res;
  //     this.resultloader = false;
  //   }, err => {
  //     console.log(err);
  //   })
  //   this.resultloader = true;
  //   await this.statusService.GetAllStatusData().subscribe(res => {
  //     this.statusList = res;
  //     this.resultloader = false;
  //   }, err => {
  //     console.log(err);
  //   })
  //   this.resultloader = true;
  //   await this.regionService.GetAllRegionData().subscribe(res => {
  //     this.regionList = res;
  //     this.resultloader = false;
  //   }, err => {
  //     console.log(err);
  //   })
  //   this.resultloader = true;
  //   await this.tpmService.GetAllUSTTPMData().subscribe(res => {
  //     this.ustTpmList = res;
  //     this.resultloader = false;
  //   }, err => {
  //     console.log(err);
  //   })
  //   this.resultloader = true;
  //   await this.locationService.GetAllLocationData().subscribe(res => {
  //     this.locationList = res;
  //     this.resultloader = false;
  //   }, err => {
  //     console.log(err);
  //   })
  //   this.resultloader = true;
  //   await this.mappingService.GetAllCandidateMappingData().subscribe((res) => {
  //     this.mappinglst = res;
  //     this.resultloader = false;
  //   },
  //     err => console.log(err))
  // }

  onSubmit() {
    this.submitted = true;
    if (this.SowForm.invalid) {
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
    let formValue = this.SowForm.value;

    let obj = {
      sowId: this.Id,
      soName: formValue.soName,
      jrCode: formValue.jrCode,
      requestCreationDate: formValue.requestCreationDate,
      accountId: formValue.accountId,
      technologyId: formValue.technologyId,
      role: formValue.role,
      regionId: formValue.regionId,
      locationId: formValue.locationId,
      targetOpenPositions: formValue.targetOpenPositions,
      positionsTobeClosed: formValue.positionsTobeClosed,
      ustpocId: formValue.ustpocId,
      recruiterId: formValue.recruiterId,
      usttpmId: formValue.usttpmId,
      dellManagerId: formValue.dellManagerId,
      statusId: formValue.statusId,
      band: formValue.band,
      projectId: formValue.projectId,
      accountManager: formValue.accountManager,
      internalResource: (formValue.internalResource == null) ? "" : formValue.internalResource,
      externalResource: (formValue.externalResource == null) ? "" : formValue.externalResource,
      type: "update",
    };
    this.service.UpdateSowData(this.Id, obj).subscribe(res => {
      alert('Data updated successfully');
      this.SowForm.reset();
      this.GetSowData();
      this.editmode = false;
      this.Id = null;
    }, err => {
      console.log(err);
      this.editmode = false;
      this.Id = null
    })
  }

  onAdd() {
    let formValue = this.SowForm.value;

    let obj = {
      soName: formValue.soName,
      jrCode: formValue.jrCode,
      requestCreationDate: formValue.requestCreationDate,
      accountId: formValue.accountId,
      technologyId: formValue.technologyId,
      role: formValue.role,
      regionId: formValue.regionId,
      locationId: formValue.locationId,
      targetOpenPositions: formValue.targetOpenPositions,
      positionsTobeClosed: formValue.positionsTobeClosed,
      ustpocId: formValue.ustpocId,
      recruiterId: formValue.recruiterId,
      usttpmId: formValue.usttpmId,
      dellManagerId: formValue.dellManagerId,
      statusId: formValue.statusId,
      band: formValue.band,
      projectId: formValue.projectId,
      accountManager: formValue.accountManager,
      internalResource: (formValue.internalResource == null) ? "" : formValue.internalResource,
      externalResource: (formValue.externalResource == null) ? "" : formValue.externalResource,
      type: "insert",
    };

    this.service.PostSowData(obj).subscribe(data => {
      alert("Candidate Added Successfully");
      this.SowForm.reset();
      this.GetSowData();
    })
  }

  editDetails(data: any) {
    this.editmode = true;
    this.Id = data.sowId;
    this.router.navigate(['/soList'], { queryParams: { editMode: this.editmode, myArray: this.Id } });
    // data.requestCreationDate = this.dateTrim(data.requestCreationDate)
    // console.log(data.requestCreationDate)
    // this.SowForm.patchValue({
    //   soName: data.soName,
    //   jrCode: data.jrCode,
    //   requestCreationDate: data.requestCreationDate,
    //   accountId: data.accountId,
    //   technologyId: data.technologyId,
    //   role: data.role,
    //   regionId: data.regionId,
    //   locationId: data.locationId,
    //   targetOpenPositions: data.targetOpenPositions,
    //   positionsTobeClosed: data.positionsTobeClosed,
    //   ustpocId: data.ustpocId,
    //   recruiterId: data.recruiterId,
    //   usttpmId: data.usttpmId,
    //   dellManagerId: data.dellManagerId,
    //   statusId: data.statusId,
    //   band: data.band,
    //   projectId: data.projectId,
    //   accountManager: data.accountManager,
    //   internalResource: data.internalResource,
    //   externalResource: data.externalResource
    //})
  }

  deleteDetails(data: any) {
    this.Id = data.sowId;
    var obj: any = null;
    var decision = confirm('Are you sure you want to delete?');
    if (decision) {
      this.mappinglst.find((x: any) => {
        if (x.sowId == this.Id) {
          obj = x;
        }
      })
      if (obj == null) {
        this.service.DeleteSowData(data.sowId).subscribe(res => {
          alert('Data Deleted Successfully');
          this.GetSowData();
          this.Id = null;
        })
      }
      else {
        alert('Mapping Exists for this SO with candidate.' + '\n' + 'Please unmap and then delete');
      }
    }
    else {
      alert('Data not deleted');
    }
  }

  dateTrim(data: any) {
    let datearr = data.split("T")
    return datearr[0];
  }

  getAccount(id: any) {
    if (this.accountList && id != null) {
      var obj: any;
      this.accountList.find((x: any) => {
        if (x.accountId == id) {
          obj = x;
        }
      })
      return obj.accountName;
    }
  }

  getTechnology(id: any) {
    if (this.technologyList && id != "") {
      var obj: any;
      this.technologyList.find((x: any) => {
        if (x.technologyId == id) {
          obj = x;
        }
      })
      return obj.technologyName;
    }
  }

  getLocation(id: any) {
    if (this.locationList && id != "") {
      var obj: any;
      this.locationList.find((x: any) => {
        if (x.locationId == id) {
          obj = x;
        }
      })
      return obj.location;
    }
  }

  getRegion(id: any) {
    if (this.regionList && id != "") {
      var obj: any;
      this.regionList.find((x: any) => {
        if (x.regionId == id) {
          obj = x;
        }
      })
      return obj.region;
    }
  }

  getUSTPOC(id: any) {
    if (this.ustPocList && id != "") {
      var obj: any;
      this.ustPocList.find((x: any) => {
        if (x.ustpocId == id) {
          obj = x;
        }
      })
      return obj.ustpocName;
    }
  }

  getUSTTPM(id: any) {
    if (this.ustTpmList && id != "") {
      var obj: any;
      this.ustTpmList.find((x: any) => {
        if (x.usttpmId == id) {
          obj = x;
        }
      })
      return obj.usttpmName;
    }
  }

  getDellManager(id: any) {
    if (this.dellManagerList && id != "") {
      var obj: any;
      this.dellManagerList.find((x: any) => {
        if (x.dellManagerId == id) {
          obj = x;
        }
      })
      return obj.dellManagerName;
    }
  }

  getStatus(id: any) {
    if (this.statusList && id != "") {
      var obj: any;
      this.statusList.find((x: any) => {
        if (x.statusId == id) {
          obj = x;
        }
      })
      return obj.statusName;
    }
  }

  getRecruiter(id: any) {
    if (this.recruiterList && id != "") {
      var obj: any;
      this.recruiterList.find((x: any) => {
        if (x.recruiterId == id) {
          obj = x;
        }
      })
      return obj.recruiterName;
    }
  }

  // download() {
  //   this.downloadObject = this.createObject(this.SOData)
  //   let headers = [['SO Id', 'SO Name', 'JR Code', 'Request Creation Date', 'Account', 'Technology', 'Role', 'Region', 'Location', 'Target Open Positions',
  //     'Positions Tobe Closed', 'Ust POC', 'Recruiter', 'Ust TPM', 'Dell Manager', 'Status', 'Band', 'Project Id', 'Account Manager', 'External Resource',
  //     'Internal Resource']]
  //   this.excelService.jsonExportAsExcel(this.downloadObject, "SO Details", headers);
  // }
  download() {
    // let downloadList:CandidateModel[]=this.CandidateList.filter( x=> this.compareFromDates(x.joiningDate,this.fromDate) && this.compareToDates(x.joiningDate,this.endDate));
    this.fromDate = new DatePipe('en-US').transform(this.fromDate, 'yyyy-MM-dd');
    this.endDate = new DatePipe('en-US').transform(this.endDate, 'yyyy-MM-dd');
    this.service.GetSOByDate(this.fromDate,this.endDate).subscribe((data)=>{
      if(data!=null || data!=undefined){
        console.log(data)
        this.downloadObject = this.createObject(data)
        let headers = [['SO Id', 'SO Name', 'JR Code', 'Request Creation Date', 'Account', 'Technology', 'Role', 'Region', 'Location', 'Target Open Positions',
        'Positions Tobe Closed', 'Ust POC', 'Recruiter', 'Ust TPM', 'Dell Manager', 'Status', 'Band', 'Project Id', 'Account Manager', 'External Resource',
        'Internal Resource']]
      this.excelService.jsonExportAsExcel(this.downloadObject, "SO Details", headers);
      }
      else
        alert('No Records found!')
    })
   
  }

  createObject(data) {
    return {
      'SO Data': data,
    }
  }

  GetSODetails() {
    if (this.SowList != undefined || this.SowList != null) {
      this.SOData = [];
      this.SowList.forEach(element => {
        let obj = {
          sowId: element.sowId,
          soName: element.soName,
          jrCode: element.jrCode,
          requestCreationDate: element.requestCreationDate,
          accountName: this.getAccount(element.accountId),
          technologyName: this.getTechnology(element.technologyId),
          role: element.role,
          region: this.getRegion(element.regionId),
          location: this.getLocation(element.locationId),
          targetOpenPositions: element.targetOpenPositions,
          positionsTobeClosed: element.positionsTobeClosed,
          ustpocName: this.getUSTPOC(element.ustpocId),
          recruiterName: this.getRecruiter(element.recruiterId),
          usttpmName: this.getUSTTPM(element.usttpmId),
          dellManagerName: this.getDellManager(element.dellManagerId),
          statusName: this.getStatus(element.statusId),
          band: element.band,
          projectId: element.projectId,
          accountManager: element.accountManager,
          externalResource: element.externalResource,
          internalResource: element.internalResource,
        }
        this.SOData.push(obj);
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

    this.batchRecord = this.SOData.slice(startIndex, endIndex);
  }

  OnNextClicked() {
    let startIndex: number = 0;
    let endIndex: number = 0;
    let indexCounter: number = 0;

    this.currentPage += 1;
    indexCounter = this.currentPage - 1;

    startIndex = indexCounter * Number(this.pageSizeSelected);
    endIndex = Number(this.pageSizeSelected) + startIndex;

    this.batchRecord = this.SOData.slice(startIndex, endIndex);
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

    this.batchRecord = this.SOData.slice(startIndex, endIndex);
  }

  SetDefaultPagination() {
    let indexCounter: number = this.currentPage - 1;
    this.pageSizeSelected = 10;

    let startIndex: number = indexCounter * Number(this.pageSizeSelected);
    let endIndex: number = Number(this.pageSizeSelected) + startIndex;
    if (this.SOData) {
      this.batchRecord = this.SOData.slice(startIndex, endIndex);
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
      this.SetDefaultPaginationForcly(this.SOData)
    }
    else if (this.searchText != undefined || this.searchText != "") {
      this.isBatchSearch = true;
      this.batchRecord = [];
      this.isBatchSearch = true;
      this.SOData.forEach(data => {
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

  onClick() {
    this.isChecked = false;
    this.eventChange.emit(this.isChecked);
  }
}    
