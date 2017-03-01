/**
 * Really simple page to just login
 */
 'use strict';

{
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

  function createCookie(name,value,days) {
     if (days) {
         var date = new Date();
         date.setTime(date.getTime()+(days*24*60*60*1000));
         var expires = "; expires="+date.toGMTString();
     }
     else var expires = "";
     document.cookie = name+"="+value+expires+"; path=/";
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

  let title = document.getElementById('login');
  let email = document.getElementById('email');
  let password = document.getElementById('password');

  function send() {
    let data = {
      email: email.value,
      password: password.value
    };
    post('/api/auth/login').attach(data).end(success => {
      console.log(success);
      title.textContent = "Success";
      createCookie('access_token', success.body.token);
      window.location = '/';
    }, failure => {
        orGiveUp();
        console.log(failure);
        title.textContent = "Failure";
    });
  }

  document.getElementById('submit').addEventListener('click', send.bind(this), false);
}
