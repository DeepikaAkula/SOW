import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { WorkBook, WorkSheet } from 'xlsx/types';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {
  sheetNames: any = [];
  constructor() {
    // to do nothing
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public jsonExportAsExcel(json: any[], excelFileName: string,headers:string[][]): void {
    let keys = this.getKeys(json);
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet([]);
    let Heading=headers;
    XLSX.utils.sheet_add_aoa(ws, Heading);
    keys.forEach(x => {
      let ar = []
      if (json[x] != null) {
        if (this.isObject(json[x])) {
          if (this.isValue(json[x])) {        
            ar.push({Value:json[x]} )
            let ws = XLSX.utils.json_to_sheet(ar);
            ws['!cols'] = [];
            XLSX.utils.book_append_sheet(wb, ws, x);
          }
          else{
            ar.push(json[x])
            let ws = XLSX.utils.json_to_sheet(ar);
            ws['!cols'] = [];
            XLSX.utils.book_append_sheet(wb, ws, x);
          }    
        } else {
          XLSX.utils.sheet_add_json(ws, json[x], { origin: 'A2', skipHeader: true });
          ws['!cols'] = []
          XLSX.utils.book_append_sheet(wb, ws, x);
        }
      }
    });
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  isObject(values) {
    if (!Array.isArray(values)) { return true; }
    else { return false; }
  }

  getKeys(object): string[] {
    if (object != null) {
      let headers= Object.keys(object);
      headers.forEach(x=>x.toUpperCase());
      return headers;
    }
    else {
      return [];
    }
  }
  isValue(value) {
    if (typeof value != "object") {
      return true;
    }
    else {return false;}
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}