import { Component,TemplateRef,ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'; 
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { localService } from "./local.service";  
export class CSVRecord {
  public Id: any;
  public WorkItem: any;
  public dueDate: any;
  public noResourcesNeeded: any; 
  }
  
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  modalRef: BsModalRef;
  public csvRecords: any[] = [];
  tabledatas: any = [];
  totalval: number = 0;
  deletedid: Number;
  itmid: any;
  Indxid: any;
  resourceForm = new FormGroup({
    workItem: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', [Validators.required]),
    noresource: new FormControl('', [Validators.required]),
  });
  EditForm = new FormGroup({
    workItem: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', [Validators.required]),
    noresource: new FormControl('', [Validators.required]),
  });
  @ViewChild('fileImportInput') fileImportInput: any;
  constructor(private modalService: BsModalService, private toastr: ToastrService, private lss: localService) {}
 ngOnInit(){
  this.getdataList();
 }
 getdataList(){
  this.tabledatas =  this.lss.getLocaldata();
  this.totalval = this.tabledatas? this.tabledatas.length: 0;
  console.log("this.tabledatas ",this.tabledatas)
 } 
 onSubmit(datas){ 
  if (this.resourceForm.controls['workItem'].status == 'VALID' &&
  this.resourceForm.controls['dueDate'].status == 'VALID' &&
  this.resourceForm.controls['noresource'].status == 'VALID') {
    this.tabledatas.push(
      {Id: Math.floor(Math.random() * 67) + 1,
        WorkItem:datas.workItem,
        dueDate: datas.dueDate,
        noResourcesNeeded: datas.noresource
      }
    )
    this.lss.setLocalData(this.tabledatas); 
    console.log("datas ",datas)
    this.modalRef.hide();
    this.resourceForm.reset(); 
    this.toastr.success('Item added successfully');
    this.getdataList();
  } else {
    console.log("dddddddddddd")
    this.toastr.error('Item failed to add');
  }
 }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }   
  fileChangeListener($event: any): void {

    let text = [];
    let files = $event.srcElement.files;

    if (this.isCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        console.log("csvRecordsArray ",csvRecordsArray)
        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        console.log("this.tabledatas", this.tabledatas)
        this.tabledatas = (this.tabledatas != null)? [...this.tabledatas,...this.csvRecords]: this.csvRecords;
        this.lss.setLocalData(this.tabledatas);
        this.toastr.success('CSV imported successfully'); 
         
        this.getdataList();
      }; 
      reader.onerror = function () {
        alert('Unable to read ' + input.files[0]); 
      }; 
    } else {
      this.toastr.error('Please import valid .csv file.'); 
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let dataArr = []; 
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let data = (<string>csvRecordsArray[i]).split(',');
 
      if (data.length == headerLength) {

        let csvRecord: CSVRecord = new CSVRecord();

        csvRecord.Id = data[0].trim();
        csvRecord.WorkItem = data[1].trim();
        csvRecord.dueDate = data[2].trim();
        csvRecord.noResourcesNeeded = data[3].trim();  
        dataArr.push(csvRecord);
      }
    }
    return dataArr;
  }

  // CHECK IF FILE IS A VALID CSV FILE
  isCSVFile(file: any) {
    console.log("file ",file)
    if(file != undefined)
    return file.name.endsWith(".csv");
  }

  // GET CSV FILE HEADER COLUMNS
  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
  } 
  confirm(id: Number): void {
    // this.toastr.success('Confirmed!');
    this.modalRef.hide();
    console.log("this.tab ",this.tabledatas);
    let removed = this.tabledatas.splice(id,1);
    this.lss.setLocalData(this.tabledatas);
        this.toastr.success('Record successfully deleted'); 
        // window.localStorage.setItem("data",JSON.stringify(this.tabledatas)); 
        this.getdataList();
    console.log("ddddd ",removed)
  }
 
  decline(): void {
    this.toastr.warning('Declined!');
    this.modalRef.hide();
  }
  deleted(template: TemplateRef<any>, id: Number) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.deletedid = id;
    
  }
  editd(template: TemplateRef<any>,obj: any, Indxid: Number) {
    this.modalRef = this.modalService.show(template); 
    this.EditForm.controls['workItem'].patchValue(obj.WorkItem);
    this.EditForm.controls['dueDate'].patchValue(obj.dueDate);
    this.EditForm.controls['noresource'].patchValue(obj.noResourcesNeeded);
    this.itmid = obj.Id;
    this.Indxid = Indxid;

    
  }
  UpdateItem(datas, Indxid: any){ 
    if (this.EditForm.controls['workItem'].status == 'VALID' &&
    this.EditForm.controls['dueDate'].status == 'VALID' &&
    this.EditForm.controls['noresource'].status == 'VALID') {
      this.tabledatas[Indxid] ={
                                Id: this.itmid,
                                WorkItem:datas.workItem,
                                dueDate: datas.dueDate,
                                noResourcesNeeded: datas.noresource
                              };
      this.lss.setLocalData(this.tabledatas);  
      this.modalRef.hide();  
      this.toastr.success('Item updated successfully');
      this.getdataList();
    } else {
      console.log("uuuuuuuuuuuu")
      this.toastr.error('Item failed to add');
    }
   }
}