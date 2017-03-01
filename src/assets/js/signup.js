/**
 * Really simple page to just Sign up
 */
 'use strict';

 //post function, easy stuff
 let post = (url) => {
   let request = new XMLHttpRequest();
   let data;
   request.open("POST", url, true);
   let adapter = {
     attach: (object) => {
       data = JSON.stringify(object);
       return adapter;
     },
     header: (...y) => {
       request.setRequestHeader.apply(request, y);
       return adapter;
     },
     end: (success, failure) => {
       data ? request.send(data) : request.send();
       request.onreadystatechange = () => {
         if (request.readyState === 4) {
           if (request.status === 200 || request.status === 204) {
             let res  = {};
             res.text = request.responseText;
             if (jsonString(request.responseText)) {
               res.body = JSON.parse(request.responseText);
             }
             success(res);
           } else {
             let err = new Error("Request to " + url + " failed." + request.responseText);
             failure(err);
           }
         }
       };
     }
   };
   return adapter;
 };

 function orGiveUp() {
   setTimeout(() => {
     let div = document.createElement('div');
     div.innerHTML = '<a href="/">or give up</a>'
     document.body.appendChild(div);
   },1000)
 }

 /**
  * Tests if String represents JSON
  *
  * @param {string} string A string that will be tested if it is JSON
  * @returns {boolean} Evaluation if string is json
  */
 function jsonString(string) {
     try {
         JSON.parse(string);
     } catch (e) {
         return false;
     }
     return true;
 }

 let title = document.getElementById('register');
 let username = document.getElementById('username');
 let email = document.getElementById('email');
 let password = document.getElementById('password');

 function send() {
   //check password
   if (password.value.length < 8 || !(/\d/.test(password.value) && /[A-Za-z]/.test(password.value))) {
     register.textContent = "Password must 7+ chars long, and have at least one number";
     return;
   }
   let data = {
     username: username.value,
     email: email.value,
     password: password.value
   };
   post('/api/auth/register').attach(data).end(success => {
     console.log(success);
     register.textContent = "Success";
   }, failure => {
       orGiveUp();
       console.log(failure);
       register.textContent = "Failure -- Try another email or username";
   });
 }

 document.getElementById('submit').addEventListener('click', send.bind(this), false);
