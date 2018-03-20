// var item;

//     Office.initialize = function () {
//         item = Office.context.mailbox.item;
//         // Checks for the DOM to load using the jQuery ready function.
//         $(document).ready(function () {
//             // After the DOM is loaded, app-specific code can run.
//             // Set data in the body of the composed item.
//             setItemBody();
//         });
//     }


//     // Get the body type of the composed item, and set data in 
//     // in the appropriate data type in the item body.
//     function setItemBody() {
//         item.body.getTypeAsync(
//             function (result) {
//                 if (result.status == Office.AsyncResultStatus.Failed) {
//                     write(result.error.message);
//                 }
//                 else {
//                     // Successfully got the type of item body.
//                     // Set data of the appropriate type in body.
//                     if (result.value == Office.MailboxEnums.BodyType.Html) {
//                         // Body is of HTML type.
//                         // Specify HTML in the coercionType parameter
//                         // of setSelectedDataAsync.
//                         item.body.setSelectedDataAsync(
//                             '<b> Kindly note we now open 7 days a week.</b>',
//                             {
//                                 coercionType: Office.CoercionType.Html,
//                                 asyncContext: { var3: 1, var4: 2 }
//                             },
//                             function (asyncResult) {
//                                 if (asyncResult.status ==
//                                     Office.AsyncResultStatus.Failed) {
//                                     write(asyncResult.error.message);
//                                 }
//                                 else {
//                                     // Successfully set data in item body.
//                                     // Do whatever appropriate for your scenario,
//                                     // using the arguments var3 and var4 as applicable.
//                                 }
//                             });
//                     }
//                     else {
//                         // Body is of text type. 
//                         item.body.setSelectedDataAsync(
//                             ' Kindly note we now open 7 days a week.',
//                             {
//                                 coercionType: Office.CoercionType.Text,
//                                 asyncContext: { var3: 1, var4: 2 }
//                             },
//                             function (asyncResult) {
//                                 if (asyncResult.status ==
//                                     Office.AsyncResultStatus.Failed) {
//                                     write(asyncResult.error.message);
//                                 }
//                                 else {
//                                     // Successfully set data in item body.
//                                     // Do whatever appropriate for your scenario,
//                                     // using the arguments var3 and var4 as applicable.
//                                 }
//                             });
//                     }
//                 }
//             });

//     }

//     // Writes to a div with id='message' on the page.
//     function write(message) {
//         document.getElementById('message').innerText += message;
//     }