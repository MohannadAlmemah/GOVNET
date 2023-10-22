import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/services/apiService';
import { Field } from '../models/field';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})

export class TestComponent {
  fields:Field[]=[];
  userForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private apiService:ApiService) {

    var request=this.apiService.get('carboncopies/GetStepForConsumer?serviceId=652a085642391618cfbc1c59');

    request.subscribe(response=>{
      var data=response.data;
      this.fields=data.fields;

      this.fields.map(field=>{
        this.userForm.addControl(field.id, this.formBuilder.control(field.value));
      })

    });

    this.userForm = this.formBuilder.group({
      users: this.formBuilder.array([this.createUser()])
    });

    this.userForm.addControl('test', this.formBuilder.control(''));
    
    console.log(this.userForm);

  }

  userControls() : any[] {
    var data= (this.userForm.get('users') as FormArray).controls;

    return data;
  }

  generateFormFields(fields: Field[]): FormGroup {
    const group: { [key: string]: any } = {};
  
    fields.forEach(field => {
      if (field.type === 'TEXT_FIELD') {
        group[field.id] = [field.value || '', field.required ? Validators.required : null];
      } else if (field.type === 'TEXT_FIELD_PHONE') {
        group[field.id] = [field.value || '', field.required ? Validators.required : null];
      } else if (field.type === 'FILE') {
        group[field.id] = [[], field.required ? Validators.required : null];
      }
      // Add additional cases for other field types (e.g., select, radio, etc.) as needed.
    });
  
    return this.formBuilder.group(group);
  }
  

  createUser() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      phoneNumbers: this.formBuilder.array([this.createPhoneNumber()])
    });
  }

  createPhoneNumber() {
    return this.formBuilder.group({
      phoneNumber: ['', Validators.required]
    });
  }

  addUser() {
    const users = this.userForm.get('users') as FormArray;
    users.push(this.createUser());

    console.log(this.userForm);

  }

  removeUser() {
    const users = this.userForm.get('users') as FormArray;
    if (users.length > 1) {
      users.removeAt(users.length - 1);
    }
  }

  addPhoneNumber(phoneNumbers: FormArray) {
    phoneNumbers.push(this.createPhoneNumber());
  }

  removePhoneNumber(phoneNumbers: FormArray) {
    if (phoneNumbers.length > 1) {
      phoneNumbers.removeAt(phoneNumbers.length - 1);
    }
  }

  submitForm() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      console.log('Form Data:', formData);
      // You can send the formData to a server or perform any other actions here.
    } else {
      console.log('Form is not valid');
    }
  }

  ngOnInit() {
  }
}
