import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IDeactivate } from '../can-deactivate-guard.service';
import { CommonService } from '../common.service';
import { StatusModel } from '../Models/StatusModel';
import { CandidateService } from '../services/candidate.service';
import { StatusserviceService } from '../services/statusservice.service';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})

export class CandidateListComponent implements OnInit, IDeactivate {

  constructor(private service: CandidateService,
    private router: ActivatedRoute,
    private commonServ: CommonService,
    private route: Router,
    private statusService: StatusserviceService) { }

  statusList: StatusModel[] = [];
  submitted: boolean = false;
  editMode: any = this.router.snapshot.queryParams['editMode']
  editDetails: any = this.router.snapshot.queryParams['myArray'];
  Id: any;
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
    pincode: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^[0-9]*$")]),
    isInternal: new FormControl(),
  })
  get f() { return this.candidateform.controls; }

  ngOnInit(): void {
    this.commonServ.headerContent(false);
    this.GetStatusByType();
    if (this.editMode) {
      this.service.GetCandidateById(this.editDetails).subscribe(res => {
        res.map((obj) => {
          this.Id = obj.candidateId;
          this.candidateform.patchValue({
            candidateName: obj.candidateName,
            dob: this.dateTrim(obj.dob),
            address: obj.address,
            email: obj.email,
            gender: obj.gender,
            joiningDate: this.dateTrim(obj.joiningDate),
            location: obj.location,
            mobileNo: obj.mobileNo,
            pincode: obj.pincode,
            skills: obj.skills,
            status: obj.status,
            isInternal: obj.isInternal
          })
        })
      })
    }
  }

  dateTrim(data: any) {
    let datearr = data.split("T")
    return datearr[0];
  }

  onSubmit() {
    this.submitted = true;
    if (this.candidateform.invalid) {
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
    let obj = this.candidateform.value;
    obj.isInternal = (obj.isInternal != true) ? false : true;
    this.service.PostCandidateData(obj).subscribe(data => {
      alert("Candidate Added Successfully");
      this.candidateform.reset();
      //this.GetCandidateData();
    })
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
      this.editMode = false;
      this.Id = null;
    }, err => {
      console.log(err);
      this.editMode = false;
      this.Id = null
    })
  }

  cancel() {
    this.route.navigate(['/candidatedetails']);
  }
  // canDeactivate(): Promise<boolean> | boolean {
  //   const confirmResult = confirm('Are you sure you want to leave this page ? ');
  //   if (confirmResult === true) {
  //   return true;
  //   } else {
  //   return false;
  //   }
  //   }

  canExit() {
    if (this.candidateform.dirty) {
      return confirm('You have unsaved changes. Do you really want to discard these changes?');
    }
    else {
      return true;
    }
  }

  GetStatusByType() {
    return new Promise((res, rej) => {
      this.statusService.GetStatusByType(1).subscribe(result => {
        this.statusList = result;
        res('')
      })
    })
  }
}
