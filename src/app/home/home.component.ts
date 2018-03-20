/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { ViewChild, NgZone, ApplicationRef, ChangeDetectorRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MeetingTimeSuggestion } from '@microsoft/microsoft-graph-types';
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types"

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HomeService } from './home.service';
import { AuthService } from '../auth/auth.service';

import { Events } from './Models/events';
import { ClipboardcopyComponent } from './homecomponents/clipboardcopy/clipboardcopy.component';

import * as moment from 'moment';
import 'hammerjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild(ClipboardcopyComponent)
  clipboardComponent: ClipboardcopyComponent;

  events: MicrosoftGraph.Event[];
  me: MicrosoftGraph.User;
  message: MicrosoftGraph.Message;

  emailSent: Boolean;
  copied: Boolean;
  error: Boolean;
  errorMessage: string = "";

  subsGetUsers: Subscription;
  subsGetMe: Subscription;
  subsSendMail: Subscription;
  subsFindMeetingTimes: Subscription;

  userStartDate: any = moment().local().format('YYYY-MM-DD');
  userStartTime: any = moment().local().format('hh:mm');
  userStartTimeAM: any = moment().local().format('hh:mm a');

  userEndDate: any;
  userEndTime: any;

  userBusinessStart: any = moment('08:00', 'hh:mm');
  userBusinessEnd: any = moment('17:00', 'hh:mm');

  userBufferTime: number = 15;
  userMeetingDuration: number = 45;
  userTimeRange: any = this.userMeetingDuration + this.userBufferTime * 2;

  startTime: string = '' + this.userStartDate + 'T' + this.userStartTime;
  endTime: string = '' + this.userEndDate + 'T' + this.userEndTime;
  meetingDuration: string = 'PT' + JSON.stringify(this.userTimeRange) + 'M';

  //Event Array holds all of the events in the users calendar for the time range
  eventArray: Array<Events> = [];
  //Meeting Time Array holds all the free times in between the events
  MeetingTimeArray: Array<any> = [];
  //Template Array holds the data for the start and end times of each of the days in the time range
  templateArray: Array<any> = [];
  //Holds the final array of sorted and removed objects, of free times
  finalArray: Array<any> = [];

  //Used for days that are not current
  bizTime: Events = {
    startTime: moment().local().format('dddd Do ' + moment(this.userBusinessStart, 'hh:mm').format('hh:mm a')),
    endTime: moment().local().format('dddd Do ' + moment(this.userBusinessEnd, 'hh:mm').format('hh:mm a')),
    timeDifference: null
  };

  //Used for initial entry in array
  timeRange: Events = {
    startTime: moment(this.userStartDate).format('dddd Do ' + this.userStartTimeAM),
    endTime: moment(this.userEndDate).format('dddd Do ' + this.bizTime.endTime),
    timeDifference: moment(this.userEndDate).diff(moment(this.userStartDate), 'days')
  }

  constructor(
    private homeService: HomeService,
    private authService: AuthService,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.subsGetMe = this.homeService.getMe().subscribe(me => this.me = me);
  }

  ngAfterViewInit() {

    this.onDatePicked(2);

    setTimeout(() =>
      this.onSendMail(), 500);
  }

  updateInput() {

    this.userTimeRange = this.userMeetingDuration + this.userBufferTime * 2;
    this.startTime = '' + this.userStartDate + 'T' + this.userStartTime;
    this.endTime = '' + this.userEndDate + 'T' + this.userEndTime;
    this.meetingDuration = 'PT' + JSON.stringify(this.userTimeRange) + 'M';
    this.userStartTimeAM = moment().local().format('hh:mm a');

    this.bizTime = {
      startTime: moment().local().format('dddd Do ' + moment(this.userBusinessStart, 'hh:mm').format('hh:mm')),
      endTime: moment().local().format('dddd Do ' + moment(this.userBusinessEnd, 'hh:mm a').format('hh:mm a')),
      timeDifference: null
    };

    this.timeRange = {
      startTime: moment(this.userStartDate).format('dddd Do ' + this.userStartTimeAM),
      endTime: moment(this.userEndDate).format('dddd Do ' + this.bizTime.endTime),
      timeDifference: moment(this.userEndDate).diff(moment(this.userStartDate), 'days')
    }
  }

  //Setting User Inputs to Variables

  onDatePicked(date: number) {
    var difference: number = date;

    for (var i = 0; i <= difference; i++) {
      var day = moment().local().add(i, 'day').format('dddd');
      if (moment().local().add(i, 'day').format('dddd') == 'Saturday') {
        difference = +difference + 2;
        date = +date + 2;
        i++;
      }
      else if (moment().local().add(i, 'day').format('dddd') == 'Sunday') {
        date++;
      }
    }
    this.userEndDate = moment().local().add(date, 'day').format('YYYY-MM-DD');
    this.userEndTime = moment(this.userEndDate).format('17:00');
  }

  onDatePickerPicked(dates: any) {
    this.userStartDate = moment(dates.startDate).format('YYYY-MM-DD');
    this.userEndDate = moment(dates.endDate).format('YYYY-MM-DD');
  }

  onBufferPicked(buffer: number) {
    this.userBufferTime = buffer;
  }

  onDurationPicked(duration: number) {
    this.userMeetingDuration = duration;
  }

  onBusinessPicked(start: any) {
    this.userBusinessStart = moment(this.userBusinessStart, 'hh:mm a').format(start.start);
    this.userBusinessEnd = moment(this.userBusinessEnd, 'hh:mm a').format(start.end);
  }

  onCopy() {
    this.copied = true;
    this.clipboardComponent.copy();
  }





  objFucntion(value1: any, value2: any) {
    var obj: Object = {
      "startTime": moment(value1, 'dddd Do hh:mm a').add(this.userBufferTime, 'minutes').format('dddd Do hh:mm a'),
      "endTime": moment(value2, 'dddd Do hh:mm a').subtract(this.userBufferTime, 'minutes').format('dddd Do hh:mm a')
    };
    return obj;
  }

  finalObjFucntion(value1: any, value2: any) {
    var obj: Object = {
      "startTime": moment(value1, 'dddd Do hh:mm a').format('dddd Do hh:mm a'),
      "endTime": moment(value2, 'dddd Do hh:mm a').format('dddd Do hh:mm a')
    };
    return obj;
  }

  onSendMail() {

    this.copied = false;
    this.emailSent = false;
    this.error = false;

    this.updateInput();

    this.homeService.getStartTime(this.startTime);
    this.homeService.getEndTime(this.endTime);
    this.homeService.getMeetingDuration(this.meetingDuration);

    this.subsFindMeetingTimes = this.homeService
      .findMeetingTimes()
      .map(res => {
        var array = JSON.stringify(res);
        var meetingTimeArray = JSON.parse(array);

        //Creating an array of event objects recieved from API Call
        this.eventArray = [];
        for (var i = 0; i < meetingTimeArray.value.length; i++) {

          var eventObj = {
            "startTime": moment.utc(meetingTimeArray.value[i].start.dateTime).local().format('dddd Do hh:mm a'),
            "endTime": moment.utc(meetingTimeArray.value[i].end.dateTime).local().format('dddd Do hh:mm a'),
            "timeDifference": moment().local().diff(moment.utc(meetingTimeArray.value[i].start.dateTime).local(), 'minutes')
          };
          this.eventArray.push(eventObj);
        }
        return this.eventArray;
      })
      .subscribe(
        times => {
          this.editTimeArray();
          if (this.finalArray.length == 0) {

            this.emailSent = false;
            this.error = true;
            this.errorMessage = "No available meeting times could be found.";
            console.log("error boolean: ", this.error)
            console.log("error message: ", this.errorMessage);
            this.ref.detectChanges();
          }
          else {
            this.emailSent = true;
            document.body.appendChild(this.clipboardComponent.dummy);
            this.clipboardComponent.dummy.value = this.clipboardComponent.textHolder;
            this.clipboardComponent.dummy.select();
            document.execCommand("copy");
            document.body.removeChild(this.clipboardComponent.dummy);
            this.ref.detectChanges();
          }
        },
        error => {
          this.error = true;
          this.errorMessage = "Meeting Times Couldn't be Retrieved. Try Again.";
          console.log(error);
          this.ref.detectChanges();
        })
  }

  editTimeArray() {

    this.MeetingTimeArray = [];

    //Sorting the eventArray by Time
    this.eventArray.sort(function (a, b) {
      return b.timeDifference - a.timeDifference;
    });

    //Meeting Time Array: Adding the free time between eventArray events to MeetingTimeArray
    if (this.eventArray.length <= 1) {
      for (var i = 0; i < this.eventArray.length; i++) {

        this.MeetingTimeArray.push(this.objFucntion(this.timeRange.startTime, this.eventArray[i].startTime));

        this.MeetingTimeArray.push(this.objFucntion(
          this.eventArray[i].endTime,
          moment(this.eventArray[i].endTime, 'dddd Do hh:mm').format('dddd Do ' + moment(this.userBusinessEnd, 'hh:mm').format('hh:mm a'))));
      }
    } else {
      for (var i = 0; i < this.eventArray.length - 1; i++) {
        if (i == 0) {

          if ((moment(this.timeRange.startTime, 'dddd Do hh:mm').format('dddd Do')) !== (moment().local().format('dddd Do'))) {

            this.MeetingTimeArray.push(this.objFucntion(
              moment(this.timeRange.startTime, 'dddd Do hh:mm').format('dddd Do ' + moment(this.userBusinessStart, 'hh:mm').format('hh:mm')),
              moment(this.eventArray[i].startTime, 'dddd Do hh:mm').format('dddd Do hh:mm')));

          } else {

            this.MeetingTimeArray.push(this.objFucntion(this.timeRange.startTime, this.eventArray[i].startTime));

          }
          this.MeetingTimeArray.push(this.objFucntion(this.eventArray[i].endTime, this.eventArray[i + 1].startTime))
        }
        else {
          this.MeetingTimeArray.push(this.objFucntion(this.eventArray[i].endTime, this.eventArray[i + 1].startTime))
        }
        if (i == this.eventArray.length - 2) {
          this.MeetingTimeArray.push(this.objFucntion(this.eventArray[i + 1].endTime, moment(this.eventArray[i + 1].endTime, 'dddd Do hh:mm').format('dddd Do ' + moment(this.userBusinessEnd, 'hh:mm').format('hh:mm a'))))
        }
      }
    }

    //Creating Template Array of Days with business hours
    this.createTemplateArray();
    this.createFinalArray();

    //Removes any elements in the Final Array that have a starting or ending time less than the current time
    //Removes any elements in the Final Array that have a time less than the meeting Duration
    //Removes any elements in the Final Array that have a time during Saturday or Sunday

    console.log("this is the Final Array Before Splice: ", this.finalArray);

    for (var i = 0; i < this.finalArray.length; i++) {
      if ((moment().local().diff(moment(this.finalArray[i].startTime, 'dddd Do hh:mm a'), 'minutes') > 0) &&
        (moment().local().diff(moment(this.finalArray[i].endTime, 'dddd Do hh:mm a'), 'minutes') > 0)) {
        this.finalArray.splice(i, 1);
        i--;
      }
    }

    for (var i = 0; i < this.finalArray.length; i++) {
      if (moment(this.finalArray[i].endTime, 'dddd Do hh:mm a')
        .diff(moment(this.finalArray[i].startTime, 'dddd Do hh:mm a'), 'minutes') < this.userMeetingDuration) {
        this.finalArray.splice(i, 1);
        i--;
      }
    }

    for (var i = 0; i < this.finalArray.length; i++) {
      if ((moment(this.finalArray[i].startTime, 'dddd Do hh:mm a').format('dddd') == 'Saturday') ||
        (moment(this.finalArray[i].startTime, 'dddd Do hh:mm a').format('dddd') == 'Sunday')) {
        this.finalArray.splice(i, 1);
        i--;
      }
    }


    this.clipboardComponent.generateOutput(this.finalArray);
    let copyButton: HTMLElement = document.getElementById('copyButton') as HTMLElement;
    copyButton.click();
    this.ref.detectChanges();



    console.log("this is the Event Array: ", this.eventArray);
    console.log("this is the Meeting Time Array: ", this.MeetingTimeArray);
    console.log("this is the Template Array: ", this.templateArray);
    console.log("this is the Final Array: ", this.finalArray);
    console.log(this.clipboardComponent.textHolder);
  }


  createTemplateArray() {
    this.templateArray = [];

    var t = 0;

    for (var i = 0; i <= this.timeRange.timeDifference; i++) {

      if (i == 0) {
        if ((moment(this.timeRange.startTime, 'dddd Do hh:mm').format('dddd Do')) !== (moment().local().format('dddd Do'))) {
          this.templateArray.push(this.objFucntion(
            moment(this.timeRange.startTime, 'dddd Do hh:mm').format('dddd Do ' + moment(this.userBusinessStart, 'hh:mm').format('hh:mm')),
            moment(this.timeRange.startTime, 'dddd Do hh:mm a').format('dddd Do ' + moment(this.userBusinessEnd, 'hh:mm').format('hh:mm a'))));
        } else {
          if (moment(this.timeRange.startTime, 'dddd Do hh:mm').diff(moment(this.bizTime.startTime, 'dddd Do hh:mm a'), 'minutes') < 0) {
            this.templateArray.push(this.objFucntion(
              moment(this.bizTime.startTime, 'dddd Do hh:mm a'),
              moment(this.timeRange.startTime, 'dddd Do hh:mm a').format('dddd Do ' + moment(this.userBusinessEnd, 'hh:mm').format('hh:mm a'))));
          } else {
            this.templateArray.push(this.objFucntion(
              this.timeRange.startTime,
              moment(this.timeRange.startTime, 'dddd Do hh:mm a').format('dddd Do ' + moment(this.userBusinessEnd, 'hh:mm').format('hh:mm a'))));
          }
        }
      } else {
        /*         if (moment(this.timeRange.startTime, 'dddd Do hh:mm').add(i, 'days').format('dddd') == 'Saturday') {
                  this.templateArray.push(this.objFucntion(
                    moment(this.timeRange.startTime, 'dddd Do hh:mm').add(i + 2, 'days').format('dddd Do ' + moment(this.userBusinessStart, 'hh:mm').format('hh:mm')),
                    moment(this.timeRange.startTime, 'dddd Do hh:mm a').add(i + 2, 'days').format('dddd Do ' + moment(this.userBusinessEnd, 'hh:mm').format('hh:mm a'))));
                }
                else if (moment(this.timeRange.startTime, 'dddd Do hh:mm').add(i, 'days').format('dddd') == 'Sunday') {
                  this.templateArray.push(this.objFucntion(
                    moment(this.timeRange.startTime, 'dddd Do hh:mm').add(i + 2, 'days').format('dddd Do ' + moment(this.userBusinessStart, 'hh:mm').format('hh:mm')),
                    moment(this.timeRange.startTime, 'dddd Do hh:mm a').add(i + 2, 'days').format('dddd Do ' + moment(this.userBusinessEnd, 'hh:mm').format('hh:mm a'))));
                }
                else { */
        this.templateArray.push(this.objFucntion(
          moment(this.timeRange.startTime, 'dddd Do hh:mm').add(i, 'days').format('dddd Do ' + moment(this.userBusinessStart, 'hh:mm').format('hh:mm')),
          moment(this.timeRange.startTime, 'dddd Do hh:mm a').add(i, 'days').format('dddd Do ' + moment(this.userBusinessEnd, 'hh:mm').format('hh:mm a'))));
        /*  } */
      }
    }
  }


  createFinalArray() {
    this.finalArray = [];

    var n = 0;

    if (this.MeetingTimeArray.length == 0) {
      for (var i = 0; i < this.templateArray.length; i++) {
        this.finalArray.push(this.finalObjFucntion(
          moment(this.templateArray[i].startTime, 'dddd Do hh:mm a'),
          moment(this.templateArray[i].endTime, 'dddd Do hh:mm a')
        ));
      }
    } else {
      for (var i = 0; i < this.MeetingTimeArray.length; i++) {
        if (moment(this.MeetingTimeArray[i].startTime, 'dddd Do hh:mm a').format('dddd Do') ==
          moment(this.MeetingTimeArray[i].endTime, 'dddd Do hh:mm a').format('dddd Do')) {

          if (
            (moment(this.MeetingTimeArray[i].startTime, 'dddd Do hh:mm a').diff(
              moment(this.templateArray[n].startTime, 'dddd Do hh:mm a'), 'minutes')) < 0) {
            this.finalArray.push(this.finalObjFucntion(
              moment(this.templateArray[n].startTime, 'dddd Do hh:mm a'),
              moment(this.MeetingTimeArray[i].endTime, 'dddd Do hh:mm a')));
          } else {

            if (
              moment(this.MeetingTimeArray[i].endTime, 'dddd Do hh:mm a').diff(
                moment(this.templateArray[n].endTime, 'dddd Do hh:mm a'), 'minutes') > 0) {
              this.finalArray.push(this.finalObjFucntion(
                moment(this.MeetingTimeArray[i].startTime, 'dddd Do hh:mm a'),
                moment(this.templateArray[n].endTime, 'dddd Do hh:mm a')));
            } else {
              this.finalArray.push(this.finalObjFucntion(
                moment(this.MeetingTimeArray[i].startTime, 'dddd Do hh:mm a'),
                moment(this.MeetingTimeArray[i].endTime, 'dddd Do hh:mm a')));
            }
          }
        } else {
          if (
            (moment(this.MeetingTimeArray[i].startTime, 'dddd Do hh:mm a').diff(
              moment(this.templateArray[n].startTime, 'dddd Do hh:mm a'), 'minutes')) < 0) {
            this.finalArray.push(this.finalObjFucntion(
              moment(this.templateArray[n].startTime, 'dddd Do hh:mm a'),
              moment(this.templateArray[n].endTime, 'dddd Do hh:mm a')));
          } else {
            this.finalArray.push(this.finalObjFucntion(
              moment(this.MeetingTimeArray[i].startTime, 'dddd Do hh:mm a'),
              moment(this.templateArray[n].endTime, 'dddd Do hh:mm a')));
          }

          n++;

          do {
            if (
              moment(this.templateArray[n].startTime, 'dddd Do hh:mm a').format('dddd Do') ==
              moment(this.MeetingTimeArray[i].endTime, 'dddd Do hh:mm a').format('dddd Do')
            ) {
              this.finalArray.push(this.finalObjFucntion(
                moment(this.templateArray[n].startTime, 'dddd Do hh:mm a'),
                moment(this.MeetingTimeArray[i].endTime, 'dddd Do hh:mm a')
              ));
            }
            else {
              this.finalArray.push(this.finalObjFucntion(
                moment(this.templateArray[n].startTime, 'dddd Do hh:mm a'),
                moment(this.templateArray[n].endTime, 'dddd Do hh:mm a')
              ));
              n++;
              if (moment(this.templateArray[n].startTime, 'dddd Do hh:mm a').format('dddd Do') ==
                moment(this.MeetingTimeArray[i].endTime, 'dddd Do hh:mm a').format('dddd Do')) {
                this.finalArray.push(this.finalObjFucntion(
                  moment(this.templateArray[n].startTime, 'dddd Do hh:mm a'),
                  moment(this.MeetingTimeArray[i].endTime, 'dddd Do hh:mm a')
                ));
              }
            }
          } while (moment(this.templateArray[n].startTime, 'dddd Do hh:mm a').format('dddd Do') !==
            moment(this.MeetingTimeArray[i].endTime, 'dddd Do hh:mm a').format('dddd Do'))
        }
      }
    }


    var dayDiffernceEnd = moment(this.templateArray[this.templateArray.length - 1].startTime, 'dddd Do hh:mm').diff(moment(this.finalArray[this.finalArray.length - 1].startTime, 'dddd Do hh:mm'), 'days');



    if (dayDiffernceEnd >= 1) {
      for (var i = this.templateArray.length - dayDiffernceEnd; i < this.templateArray.length; i++) {
        this.finalArray.push(this.finalObjFucntion(
          moment(this.templateArray[i].startTime, 'dddd Do hh:mm a'),
          moment(this.templateArray[i].endTime, 'dddd Do hh:mm a')
        ));
      }
    }

    if (this.MeetingTimeArray.length == 1) {

      var dayDifferenceStart = moment(this.MeetingTimeArray[0].startTime, 'dddd Do hh:mm').diff(moment(this.templateArray[0].startTime, 'dddd Do hh:mm'), 'days');

      for (var i = 0; i <= dayDifferenceStart; i++) {
        if (i !== dayDifferenceStart) {
          this.finalArray.push(this.finalObjFucntion(
            moment(this.templateArray[i].startTime, 'dddd Do hh:mm a'),
            moment(this.templateArray[i].endTime, 'dddd Do hh:mm a')
          ));
        } else {
          this.finalArray.push(this.finalObjFucntion(
            moment(this.MeetingTimeArray[0].startTime, 'dddd Do hh:mm a'),
            moment(this.MeetingTimeArray[0].endTime, 'dddd Do hh:mm a')
          ))
        }
      }
    }
  }

  ngOnDestroy() {
    this.subsGetUsers.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  onLogin() {
    this.authService.login();
  }
}
