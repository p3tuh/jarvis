(function() {
  'use strict';

  var root = this;

  var SpeechRecognition = root.SpeechRecognition ||
                          root.webkitSpeechRecognition ||
                          root.mozSpeechRecognition ||
                          root.msSpeechRecognition ||
                          root.oSpeechRecognition;

  if(!SpeechRecognition) {
    root.Jarvis = null;
    return;
  }

  var commandsList = {};
  var recognition;
  var autoRestart = true;
  var lastStartedAt = 0;
  var pauseListening = false;
  var accessToken; 

  var callbacks = {
                    start: [],
                    error: [],
                    end: [],
                    result: [],
                    resultMatch: [],
                    noMatch: []
  };

  var invokeCallbacks = function(callbacks) {
    callbacks.forEach(function(cb) {
      cb.callback.apply(cb.context);
    });
  };

  var isInitialized = function() {
    return recognition !== undefined;
  };

  var Jarvis = function() {};

  Jarvis.prototype = {

    initIfNeeded : function() {
      if(!isInitialized()) {
        this.init({});
      }
    },

    init : function() {
        //starting a new session of speech recogntion in browser
      recognition = new SpeechRecognition();
      recognition.maxAlternatives = 5;
      recognition.continuous = true;
      recognition.lang = 'en-US';

      recognition.onstart = function() {
        console.log('now listening!');
          //optional callback to call when starting a new session. eg, have icon showing that jarvis is listening
        invokeCallbacks(callbacks.start);
      };

      recognition.onerror = function(event) {
        console.log('onerror: ', event);
        invokeCallbacks(callbacks.error);
        switch(event.error) {
          case 'network':
            invokeCallbacks(callbacks.errorNetwork);
            break;
          case 'not-llowed': 
            autoRestart = false;
          case 'sevice-not-allowed':
            autoRestart = false;
            if(new Date().getTime() - lastStartedAt < 200) {
              invokeCallbacks(callbacks.errorPermissionBlocked);
            } else {
              invokeCallbacks(callbacks.errorPermissionDenied);
            }
            break;
        }
      };

      recognition.onend = function() {
        invokeCallbacks(callbacks.end);
        if(autoRestart) {
          console.log('onEnd, now restarting');
          var timeSinceLastStart = new Date().getTime() - lastStartedAt;
          if(timeSinceLastStart < 1000) {
            setTimeout(this.start, 1000 - timeSinceLastStart);
          } else {
            this.start();
          }
        }
      };

      recognition.onresult = function(event) {
        if(pauseListening) {
          console.log('listening is paused');
          return false;
        }

          //invoke callback result to show user that a search is in progress
        invokeCallbacks(callbacks.result);

          //grabs the first possible user voice input, which has the highest confidence number
        var command = event.results[event.resultIndex][0].transcript.trim();
        console.log(command);

          // ajax request to wit.ai with user's command
        $.ajax({  
          url: 'https://api.wit.ai/message',
          data: {
            'q': command,
            'access_token' : accessToken
          },
          dataType: 'jsonp',
          method: 'GET',
          success: function(response) {
              var outcomes = response.outcomes[0].entities;
                //intent is what the user wants wit.ai to do eg: navigate_places
              var intent = response.outcomes[0].intent;
              console.log('the intent is: ', intent);
              console.log('the outcomes are: ', outcomes)
              
                //if intent is found in the commandsList, then pass the response data to the paired function and invoke it
              if(commandsList[intent]) {
                commandsList[intent](outcomes);
                invokeCallbacks(callbacks.resultMatch);
                return true;
              } else {
                invokeCallbacks(callbacks.noMatch);

              }
          },
          error: function() {
              //error with the ajax request, 
            invokeCallbacks(callbacks.noMatch);
          }
        });

      };
    },

    start : function(token) {
      accessToken = token;
      pauseListening = false;
      this.initIfNeeded();
      lastStartedAt = new Date().getTime();

      try {
        recognition.start();
      } catch(error) {
        console.log(error.message);
      }
    },

    pause : function() {
      pauseListening = true;
    },

    addCommands : function(commands) {
      this.initIfNeeded();
        
        //commands is an object containing commands and their paired functions to invoke 
      for(var key in commands) {  
        commandsList[key] = commands[key];
      }

      return Object.keys(commandsList);
    },

    addCallback : function(type, callback, context) {
      if(callbacks[type] === undefined) {
        return;
      }

      var cb = root[callback] || callback;
      if(typeof cb !== 'function') {
        return;
      }
      callbacks[type].push({ callback: cb, context: context || this });
      return callbacks[type].length;
    }

  };
  
  this.Jarvis = Jarvis;

}).call(this);