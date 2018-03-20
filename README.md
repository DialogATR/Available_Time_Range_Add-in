Available Time Range
========

The Available Time Range add-in is a Dialog internal project designed to save the user time when scheduling meetings. 

The add-in uses Microsoft's Graph service to retrieve the user's Outlook calendar events. The start and end times inbetween these events are calculated to return an array of free time slots. These are copied to the user's clipboard and can be pasted into Outlook's email body. The ATR add-in is available for use when composing a new email. 

Design Goals
------------

- Save time
- Increase productivity
- Reduce user effort

About the Project
----------------

Start Date: 16th of February 2018

•	Angular 5.2.6
•	Typescript 2.7.2
•	jQuery 3.3.1
•	Angular Material 5.2.3
•	Microsoft Graph Types 1.1.0
•	Microsoft Graph Client 1.0.0
•	Microsoft Fabric UI 1.0
•	Microsoft Office.js 16.0.9
•	Moment 2.20.1


Important Points
---------------
The 'CalendarView' API is primarily used to achieve the project goal. Users can alter the range of times retrieved by the request using the user interface.

The CalendarView request is located in 'home.service.ts': 

.api('/me/calendarview?startdatetime=' + moment.utc(startParse.source._value).subtract(9.5, 'hours').format() + '&enddatetime=' + moment.utc(endParse.source._value).subtract(9.5, 'hours').format() + '&$top=1000')

**note** the start time and end time are subtracted by 9.5. This is to convert the returned default format, UTC, to Darwin time. Also, the element '&$top=1000' defines how many events to return, the default being 10.

Installation
------------

Currently, there are two ways to install this add-in and we are still experimenting with both.

<b>1. Request Office administration to add account to add-in user group (not recommended)</b>

This option is faster to carry out and also means multiple users can be added at once. This process involves contacting the Dialog IT Office administrator and requesting the desired user email account(s) to be added to the valid user group for the ATR add-in. The ATR add-in will now appear on the 'Message' tab of the 'New Email' ribbon as a clickable button.

<b>2. Manual installation (recommended)</b>

This option is not preferred because it requires the user(s) Office account to be elevated to a higher license (E3), which are valuable and limited in supply. This is necessary because lower licences (E1) cannot add custom Outlook add-ins. Contact the Dialog IT Office administrator and specify the user email accounts to be elevated to E3 licenses. <b>After completing this step a reinstallation of Office 365 is required.</b> 

To add the add-in:

      1. Open Outlook 2016 (desktop client).
      2. Click 'Store' on the 'Home' ribbon.
      3. On the left navigation panel. click 'My add-ins'.
      4. Under 'Custom add-ins'. click the dropdown 'Add a custom add-in' and choose 'Add from file'.
      5. Navigate to '\\otwdwndevsql01.devnet.dg.internal\TestATR' within file explorer.
      6. Select 'atr-manifest.xml' and press 'Open'.
      7. The ATR add-in will now appear on the 'Message' tab of the 'New Email' ribbon as a clickable button.

To uninstall the add-in:

      1. Open Outlook 2016 (desktop client).
      2. Click 'Store' on the 'Home' ribbon.
      3. On the left navigation panel click 'My add-ins'.
      4. Under 'Custom add-ins', click the 3 dots on the add-in.
      5. Click 'Remove'.

Using the add-in
----------------

      1. Open a New Email.
      2. Click the ATR add-in which appears on the 'Message' tab of the 'New Email' ribbon.
      3. Click 'Connect' to connect to the Microsoft Graph service.
      4. If it is your first time using the add-in in this Outlook session, log in is required.
      5. Accept any permissions necessary and supply Dialog credientials when prompted.
      
To use the default parameters:
      
      1. Click the 'Get Meeting Availability' button.
      2. Paste your message into the email body using 'CTRL + V' or 'right click + paste'.
      
Adjusting the parameters:

      1. The first set of parameters (business days) will adjust the range of days for which to return events. 
      The request currently ignores weekend events.
      2. Next, input the length (in minutes) of meeting required.
      3. Do the same for Buffer Time, which is a period (in minutes) which is applied before and after the 
      Meeting Duration, to allow for travel and setup times.
      4. Lastly, configure the Business Hours parameters, which control for what times to return meeting times. 
      5. Click the 'Get Meeting Availability' button.
      6. Paste your message into the email body using 'CTRL + V' or 'right click + paste'.

Contribute
----------

The project files are hosted on Dialog IT's internal Git. Navigate to 'http://otwdwndevsql01.devnet.dg.internal/Git/' and supply your company credentials. The current project is 'ATR1'.

To clone the repository, copy 'http://otwdwndevsql01.devnet.dg.internal/Git/ATR1.git' into SourceTree or your Git client of choice. Ensure the command 'npm install' is run (VS Code Integrated Terminal), to install the project's node package modules.

Use 'Npm run start' to compile the project and navigate to 'https://localhost:4200/' in your browser to view the add-in. Additionally you can view the add-in if installed into Outlook 2016.

Deploying
---------

To deploy the project a few changes need to be made beforehand:

    1. Navigate to 'protractor.conf.js' and uncomment the github Url and comment the localhost Url. Save.
    2. Navigate to 'auth.service.ts' and uncomment the github Url and comment the localhost Url. Save.
    3. Navigate to 'configs.ts' and uncomment the production appId and comment the development appId. Save.
    
(Undo these changes to return to development)
    
    4. Run 'ng build --prod --base-href https://dialogatr.github.io/Available_Time_Range_Add-in/' in the 
    Integrated Terminal (VS Code) to create a minified version of the project 
    in a folder called 'dist'. 
    5. Run 'angular-cli-ghpages --repo=https://github.com/DialogATR/Available_Time_Range_Add-in.git' to push the changes to
    github.
    
Navigate to 'https://dialogatr.github.io/Available_Time_Range_Add-in/' to view the add-in in-browser.

**note** If changes are made to the 'atr-manifest.xml' file located at \\otwdwndevsql01.devnet.dg.internal\TestATR, you will need to re-add the add-in to Outlook for the changes to take effect.
**note** The atr-manifest.xml located at \\otwdwndevsql01.devnet.dg.internal\TestATR is different to the version located in the project folder (aka in visual studio code). The VS code version has links to the local host 4200, whereas the Dialog server version points to the hosted github files location.
   
Support
-------

If you are having issues, please let us know.

Contributors:
Jack_Silburn@dialog.com.au,
Rhys_Haydon@dialog.com.au

Project Manager:
David_Bradley@dialog.com.au

Thank you and enjoy the add-in!
