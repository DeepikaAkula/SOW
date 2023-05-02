import { Component, OnInit } from '@angular/core';
import {  Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginationcommon',
  templateUrl: './paginationcommon.component.html',
  styleUrls: ['./paginationcommon.component.css']
})
export class PaginationcommonComponent implements OnInit {
  @Input() currentPage: number=1;
  @Input() totalPages: number=0;
  @Output() pageChanged = new EventEmitter<number>();

  pageSizeSelected: number = 10;
  batchRecord: any = [];
  loginData:any=[];
 
  batchFilteredRecord: any;
  constructor() { }

  ngOnInit(): void {
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

}



 










