/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client";
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { HttpService } from '../shared/http.service';
import { Body } from '@angular/http/src/body';
import { Events } from './Models/events';
import { HomeComponent } from './home.component';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';


@Injectable()
export class HomeService {
  url = 'https://graph.microsoft.com/v1.0';

  home: HomeComponent;

  private startTimeSource = new BehaviorSubject<string>("something");
  private endTimeSource = new BehaviorSubject<string>("something");
  private durationTimeSource = new BehaviorSubject<string>("something");

  currentStartTime = this.startTimeSource.asObservable();
  currentEndTime = this.endTimeSource.asObservable();
  currentDurationTime = this.durationTimeSource.asObservable();

  constructor(
    private http: Http,
    private httpService: HttpService,
  ) {
  }

  getStartTime(startTime: string){
    this.startTimeSource.next(startTime);
  }

  getEndTime(endTime: string){
    this.endTimeSource.next(endTime);
  }

  getMeetingDuration(duration: string){
    this.durationTimeSource.next(duration);
  }

  ngOnInit(){
 
  }

  getClient(): MicrosoftGraphClient.Client {
    var client = MicrosoftGraphClient.Client.init({
      authProvider: (done) => {
        done(null, this.httpService.getAccessToken()); //first parameter takes an error if you can't get an access token
      }
    });
    return client;
  }

  getMe(): Observable<MicrosoftGraph.User> {
    var client = this.getClient();
    return Observable.fromPromise(client
      .api('me')
      .select("displayName, mail, userPrincipalName")
      .get()
      .then((res => {
        return res;
      }))
    );
  }

  findMeetingTimes() : Observable<Events>{
    var client = this.getClient();

    var startString = JSON.stringify(this.currentStartTime);
    var startParse = JSON.parse(startString);

    var endString = JSON.stringify(this.currentEndTime);
    var endParse = JSON.parse(endString);

    var durationString = JSON.stringify(this.currentDurationTime);
    var durationParse = JSON.parse(durationString);

    //Calling the Graph API for all available time ranges between the specified time (99 Max entries)
    return Observable.fromPromise(
      client
      //Converting the user start and end time to UTC be subtracting 9.5 hours to the time
        .api('/me/calendarview?startdatetime=' + moment.utc(startParse.source._value).subtract(9.5, 'hours').format() + '&enddatetime=' + moment.utc(endParse.source._value).subtract(9.5, 'hours').format() + '&$top=1000')
        .get()
        .then((res) => {
            return res;
        })
    )
  }
}