import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-businesshours',
  templateUrl: './businesshours.component.html',
  styleUrls: ['./businesshours.component.css']
})
export class BusinesshoursComponent implements OnInit {

  @Output() businessPicked: EventEmitter<any> = new EventEmitter<any>();

  click(start: string, end: string): void{
      this.businessPicked.emit({start, end});
  }

  constructor() { }

  ngOnInit() {
  }

}
