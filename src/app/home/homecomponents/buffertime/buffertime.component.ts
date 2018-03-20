import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-buffertime',
  templateUrl: './buffertime.component.html',
  styleUrls: ['./buffertime.component.css']
})
export class BuffertimeComponent implements OnInit {

  @Output() bufferPicked: EventEmitter<number> = new EventEmitter<number>();


  
  click(buffer: string): void{
      this.bufferPicked.emit(+buffer);
  }


  constructor() { }

  ngOnInit() {
  }

}
