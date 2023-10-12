import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Field } from 'src/app/models/field';
import { FileModel } from 'src/app/models/file';
import { ApiService } from 'src/services/apiService';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  /**
   *
   */
  constructor(private apiService:ApiService) {
    
  }
  ngOnInit(): void {
    
    setTimeout(() => {

        this.makeInputDisable(this.fieldId!);

    }, 1000);

  }
  
  @Input() formGroup: UntypedFormGroup|undefined;

  @Input()
  field!: Field;

  @Input()
  fieldId:string|undefined;

  @Input()
  yourTurn:boolean|undefined;

  @Input()
  submitted:boolean|undefined;

  @Input()
  control!: any;

  @Input()
  errors:any;

  @Input()
  isInvalid:boolean=false;

  @Input()

  files:FileModel[]=[];

  @Input()
  viewApplication:boolean=false;

  @Input()
  isContainer:boolean=false;

  @Input()
  containerFieldId:string|undefined=undefined;

  @Input()
  fieldIndex:number|undefined=undefined;

  @Output() 
  refreshFormEvent:EventEmitter<{fieldId: string, shouldRefresh: boolean}>=new EventEmitter<{fieldId: string, shouldRefresh: boolean}>();

  @Output() 
  deleteFileEvent:EventEmitter<{fieldId: number}>=new EventEmitter<{fieldId: number}>();

  @Output() 
  onUploadFileEvent:EventEmitter<{fieldId: string,event:any,multi:boolean}>=new EventEmitter<{fieldId: string,event:any,multi:boolean}>();

  
  
  
  refreshForm(fieldId: string, shouldRefresh: boolean){
    this.refreshFormEvent.emit({fieldId,shouldRefresh});
  }

  deleteFile(fieldId:number){

    this.deleteFileEvent.emit({fieldId});

  }

  onUploadFile(fieldId: string,event:any,multi:boolean) {

    this.onUploadFileEvent.emit({ fieldId, event, multi });

  }

  allowedExtension(mediaType: string, allowedExtension: string[]|undefined): string[] {

    if (mediaType === 'ANY') {
      return ['*']; // Allow all file types (wildcard)
    } else if (mediaType === 'MEDIA') {
      return ['.mp3', '.mp4', '.avi']; // Add the media extensions you want to allow
    } else if (mediaType === 'IMAGE') {
      return ['.jpg', '.jpeg', '.png', '.gif']; // Add the image extensions you want to allow
    } else if (mediaType === 'VIDEO') {
      return ['.mp4', '.avi', '.mov']; // Add the video extensions you want to allow
    } else if (mediaType === 'AUDIO') {
      return ['.mp3', '.wav']; // Add the audio extensions you want to allow
    } else if (mediaType === 'CUSTOM') {
      return allowedExtension!.map(extension => `.${extension}`);
    } else {
      return []; // Return an empty array for unknown media types
    }
  }

  downloadMinioFile(objectId:string){
    var request=this.apiService.get(`Minio/GetFile?ObjectName=${objectId}`);
    request.subscribe(response=>{

      this.downloadFile(response.data?.objectstat?.objectName,response.data.data,response.data?.objectstat?.contentType);

    })
  }

  makeInputDisable(id:string){

    if(this.field.editable==false){
      this.formGroup?.get(id)?.disable();
    }

  }

  downloadFile(fileName:string,data: any,fileFormat:string): void {
    const linkSource = 'data:'+fileFormat+';base64,'+data;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

}
