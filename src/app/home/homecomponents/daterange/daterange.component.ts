import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


@Component({
  selector: 'app-daterange',
  templateUrl: './daterange.component.html',
  styleUrls: ['./daterange.component.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-AU'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class DaterangeComponent implements OnInit {

  @Output() datePicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() datepickerPicked: EventEmitter<any> = new EventEmitter<any>();
  hideDate: boolean = true;
  datePickerStartDate: any = Date();
  datePickerEndDate: any = Date();

  datePickerForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl()
  })
  constructor(private adapter: DateAdapter<any>) { }

  ngOnInit() {
  }

  click(date: any): void {
    if (date != true) {
      this.datePicked.emit(date.toString());
      this.hideDate = true;
    }
    else {
      this.hideDate = false;
    }
  }

  dateEmit() {
    if (this.hideDate == false) {
      var startDate = this.datePickerStartDate;
      var endDate = this.datePickerEndDate;
      this.datepickerPicked.emit({ startDate, endDate });
    }
  }




}
