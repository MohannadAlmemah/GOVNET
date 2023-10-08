import { Component, Input } from '@angular/core';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-predefined-combo-box-view',
  templateUrl: './predefined-combo-box-view.component.html',
  styleUrls: ['./predefined-combo-box-view.component.css']
})
export class PredefinedComboBoxViewComponent {

  @Input()
  field!: Field;

  @Input()
  fieldId:string|undefined;
  
}
