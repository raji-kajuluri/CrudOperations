import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { employModel } from './employ.model';
import Swal from 'sweetalert2';
import employData from '../employ.json';

@Component({
  selector: 'app-employ',
  templateUrl: './employ.component.html',
  styleUrls: ['./employ.component.scss']
})
export class EmployComponent implements OnInit {
  exform!: FormGroup;
  employmodelobj: employModel = new employModel();
  employdata: any;
  display: boolean = false;
  formValue: any;
  showAdd!: boolean;
  showUpdate!: boolean;
  

  constructor(private formBuilder: FormBuilder, private _api: ApiService) { }
  employs = employData.data;
  employs1 = employData.data1;
  employs2 = employData.data2;
  ngOnInit(): void {
    this.exform = this.formBuilder.group({
      'name': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'city': new FormControl('', Validators.required),
      'number': new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    });
    this.getallemploy();

  }
  showBasicDialog() {
    this.display = true;
    this.exform.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  postemploy() {
    console.log("hello")
    this.employmodelobj.name = this.exform.value.name;
    this.employmodelobj.email = this.exform.value.email;
    this.employmodelobj.city = this.exform.value.city;
    this.employmodelobj.number = this.exform.value.number;
    this._api.postEmploy(this.employmodelobj)
      .subscribe((res: any) => {
        console.log(res);
        Swal.fire("Employee added successfully");
        let ref = document.getElementById('cancel')
        ref?.click();
        this.exform.reset();
        this.getallemploy();
      });
    (_err: any) => {
      alert("something wrong");
    };
    this.display = false;
  }
  getallemploy() {
    this._api.getemploy()
      .subscribe(res => {
        this.employdata = res;
      })
  }
  deleteemploy(row: any) {
    this._api.deleteemploy(row.id)
      .subscribe(res => {
        Swal.fire("Employee deleted");
        this.getallemploy();
      })
  }
  onedit(row: any) {
    this.display = true;
    this.showAdd = false;
    this.showUpdate = true;
    this.employmodelobj.id = row.id;
    this.exform.controls['name'].setValue(row.name);
    this.exform.controls['email'].setValue(row.email);
    this.exform.controls['city'].setValue(row.city);
    this.exform.controls['number'].setValue(row.number);
  }
  updateemploy() {
    this.employmodelobj.name = this.exform.value.name;
    this.employmodelobj.email = this.exform.value.email;
    this.employmodelobj.city = this.exform.value.city;
    this.employmodelobj.number = this.exform.value.number;
    this._api.updateemploy(this.employmodelobj, this.employmodelobj.id)
      .subscribe((res: any) => {
        console.log(res)
        Swal.fire("Employee updated successfully")
        let ref = document.getElementById('cancel')
        ref?.click();
        this.exform.reset();
        this.getallemploy();
        this.display = false;
      })
  }
  reset(){
    this.exform.reset();
    this.getallemploy();
  }
}


