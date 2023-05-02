import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDeactivate } from '../can-deactivate-guard.service';
import { AccountModel } from '../Models/AccountModel';
import { DellManagerModel } from '../Models/DellManagerModel';
import { LocationModel } from '../Models/LocationModel';
import { MappingModel } from '../Models/MappingModel';
import { RecruiterModel } from '../Models/RecruiterModel';
import { RegionModel } from '../Models/RegionModel';
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
  selector: 'app-so-list',
  templateUrl: './so-list.component.html',
  styleUrls: ['./so-list.component.css']
})

export class SoListComponent implements OnInit, IDeactivate {
  submitted: boolean = false;
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
  resultloader: boolean = false;
  editMode: any = this.router.snapshot.queryParams['editMode']
  editDetails: any = this.router.snapshot.queryParams['myArray'];
  Id: any;

  constructor(private service: SOWService, private regionService: RegionserviceService, private locationService: LocationserviceService,
    private accountService: AccountserviceService, private tpmService: UsttpmserviceService, private pocService: UstpocserviceService, private recruiterService: RecruiterserviceService,
    private dellManagerService: DellmanagerserviceService, private statusService: StatusserviceService, private techService: TechnologyService,
    private mappingService: CandidatemappingService, private excelService: ExcelService, private login: LoginService,
    private router: ActivatedRoute, private route: Router) { }

  ngOnInit(): void {
    this.GetDropdown1();
    this.GetDropdown2();
    this.GetDropdown3();
    this.GetDropdown4();
    this.GetDropdown5();
    //this.getStatus();
    this.GetStatusByType();
    this.GetDropdown7();
    this.GetDropdown8();
    this.GetDropdown9();
    this.GetDropdown10();
    if (this.editMode) {
      this.service.GetSowById(this.editDetails).subscribe(res => {
        res.map((data) => {
          this.Id = data.sowId
          this.SowForm.patchValue({
            soName: data.soName,
            jrCode: data.jrCode,
            requestCreationDate: this.dateTrim(data.requestCreationDate),
            accountId: data.accountId,
            technologyId: data.technologyId,
            role: data.role,
            regionId: data.regionId,
            locationId: data.locationId,
            targetOpenPositions: data.targetOpenPositions,
            positionsTobeClosed: data.positionsTobeClosed,
            ustpocId: data.ustpocId,
            recruiterId: data.recruiterId,
            usttpmId: data.usttpmId,
            dellManagerId: data.dellManagerId,
            statusId: data.statusId,
            band: data.band,
            projectId: data.projectId,
            accountManager: data.accountManager,
            internalResource: data.internalResource,
            externalResource: data.externalResource
          })
        })
      })
    }
  }

  dateTrim(data: any) {
    let datearr = data.split("T")
    return datearr[0];
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

  onSubmit() {
    this.submitted = true;
    if (this.SowForm.invalid) {
      return;
    }
    if (this.editMode) {
      this.onEdit();
    }
    else {
      this.onAdd();
    }
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
      //this.GetSowData();
    })
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
      this.editMode = false;
      this.Id = null;
    }, err => {
      console.log(err);
      this.editMode = false;
      this.Id = null
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

  getStatus() {
    return new Promise((res, rej) => {
      this.statusService.GetAllStatusData().subscribe(result => {
        this.statusList = result;
        res('')
      })
    })
  }

  GetStatusByType() {
    return new Promise((res, rej) => {
      this.statusService.GetStatusByType(0).subscribe(result => {
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

  cancel() {
    this.route.navigate(['/sow']);
  }

  canExit() {
    if (this.SowForm.dirty) {
      return confirm('You have unsaved changes. Do you really want to discard these changes?');
    }
    else {
      return true;
    }
  }
}
