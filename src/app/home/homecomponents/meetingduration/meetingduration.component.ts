import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-meetingduration',
  templateUrl: './meetingduration.component.html',
  styleUrls: ['./meetingduration.component.css']
})
export class MeetingdurationComponent implements OnInit {

@Output() durationPicked: EventEmitter<number> = new EventEmitter<number>();

click(duration: string): void{
    this.durationPicked.emit(+duration);
}

  constructor() { }

  ngOnInit() {
  }

}
