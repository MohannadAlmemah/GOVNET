import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, UntypedFormGroup } from '@angular/forms';
import { Container } from 'src/app/models/ContainerField';
import { Field } from 'src/app/models/field';
import { FileModel } from 'src/app/models/file';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {


  ngOnInit(): void {

  }

  @Input()
  field!: Field;

  @Input()
  calculationField!: Field[];

  @Input()
  fieldId:string|undefined;

  @Input() 
  myForm: UntypedFormGroup|undefined;

  @Input()
  yourTurn:boolean|undefined;

  @Input()
  submitted:boolean|undefined;

  @Input()
  viewApplication:boolean|undefined;

  @Input()
  containerItems:Container[]=[];

  @Input()
  allcontainers:Container[]=[];


  @Input()
  phoneDto:any;

  @Input()
  files:FileModel[]=[];

  @Output() 
  deleteContainerEvent:EventEmitter<{indexId: number, containerId: string}>=new EventEmitter<{indexId: number, containerId: string}>();


  @Output() 
  addContainerItemsEvent:EventEmitter<{field:Field}>=new EventEmitter<{field:Field}>();

  @Output() 
  refreshFormEvent:EventEmitter<any>=new EventEmitter<any>();

  @Output() 
  getFormControlErrorsEvent:EventEmitter<string>=new EventEmitter<string>();

  @Output() 
  getFormControlValidationEvent:EventEmitter<string>=new EventEmitter<string>();
  
  @Output()
  calulcateTextFieldEvent:EventEmitter<string>=new EventEmitter<string>;

  calculate(id:string){
    this.calulcateTextFieldEvent.emit(id);
  }


  getFormControlValidation(fieldId:string){
    this.getFormControlValidationEvent.emit(fieldId);

  }

  getFiles(controlName:string):FileModel[]{
    return this.files.filter(x=>x.controlName==controlName);
  }
  
  getFormControlErrors(fieldId:string){
    this.getFormControlErrorsEvent.emit(fieldId);
  }
  
  refreshForm(event:any){
    this.refreshFormEvent.emit(event);
  }

  addContainerItems(field:Field){
    this.addContainerItemsEvent.emit({field});
  }

  deleteContainer(indexId: number, containerId: string) {
    this.deleteContainerEvent.emit({indexId,containerId});
  }

  GetContainerItems(containerId:string):Container[]{

    var containerItems= this.allcontainers.filter(x=>x.containerId==containerId);

    return containerItems;
  }

}
