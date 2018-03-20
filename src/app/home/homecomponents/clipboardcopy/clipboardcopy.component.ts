import { Component, OnInit, Input } from '@angular/core';
import { Events } from '../../Models/events';
import * as moment from 'moment';
import { Time } from '@angular/common';

@Component({
  selector: 'app-clipboardcopy',
  templateUrl: './clipboardcopy.component.html',
  styleUrls: ['./clipboardcopy.component.css'],
})
export class ClipboardcopyComponent implements OnInit {
  @Input() finalArray: Array<any>;
  textHolder: string;
  dummy: any;
  t = 0;


  constructor() { }

  ngOnInit() {
    this.dummy = document.createElement("textarea");
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.outputText(this.finalArray)
    }, 100);
  }

  outputText(finalArray) {
    this.t = 0
    this.generateOutput(finalArray)
  }

  generateOutput(finalArray) {
    //delete this before deploy
    //var pasteElement = document.getElementById('editableDiv');
    // ^^
    this.textHolder = "I am available at the following times, please let me know what is convenient for you. \r\n"

    for (var i = 0; i < finalArray.length; i++) {
      //Check if there is data in the index
      if (finalArray[i] !== undefined) {
        //After the first loop, check if the previous day is the same as the day about to be printed, if so, don't print it        
        if (i > 0 && moment(finalArray[i].startTime, 'dddd Do hh:mm a').format('dddd') ==
          moment(finalArray[i - 1].startTime, 'dddd Do hh:mm a').format('dddd')) {
          this.textHolder += moment(finalArray[i].startTime, 'dddd Do hh:mm a').local().format('\t\t hh:mm a')
            + ' to '
            + moment(finalArray[i].endTime, 'dddd Do hh:mm a').format('hh:mm a')
            + '\r\n';
        } else {
          //Friday is the shortest day of the week, so it needs 2 tabs
          if (moment(finalArray[i].startTime, 'dddd Do hh:mm a').format('dddd') == 'Friday') {
            this.textHolder += moment(finalArray[i].startTime, 'dddd Do hh:mm a').local().format('dddd \t\t hh:mm a')
              + ' to '
              + moment(finalArray[i].endTime, 'dddd Do hh:mm a').format('hh:mm a')
              + '\r\n';
          } else {
            this.textHolder +=
              moment(finalArray[i].startTime, 'dddd Do hh:mm a').local().format('dddd \t hh:mm a') //adding some tabs, it's a bit wonky
              + ' to '
              + moment(finalArray[i].endTime, 'dddd Do hh:mm a').format('hh:mm a')
              + '\r\n';
          }
        }
      }
    }
    //delete this for deploy
    //pasteElement.innerHTML = textHolder;
    //Copy to clip board function

    /* document.body.appendChild(this.dummy);
    this.dummy.value = this.textHolder;
    this.dummy.select();
    document.execCommand("copy");
    document.body.removeChild(this.dummy); */

    /*     if (this.t < 1) {
          this.t++;
          setTimeout(() => {
            this.generateOutput(finalArray)
          }, 500);
        } */
  }

  copy() {
    document.body.appendChild(this.dummy);
    this.dummy.value = this.textHolder;
    this.dummy.select();
    document.execCommand("copy");
    document.body.removeChild(this.dummy);
  }
} 
