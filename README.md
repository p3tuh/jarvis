### Jarvis Overview

Jarvis is a voice activated library that uses the browser's native speech recognition in conjunction with wit.ai's open source natural language api. My approach for this particular project was to use the browsers native speech recogntion to convert the user's voice command into a string, make an api request to wit.ai with the string, and then make a request to yahoo with the results. This has been tested and developed in the chrome browser.

### Get it started

From the root directory:

1. python -m SimpleHTTPServer
2. open a chrome browser and enter the following url:
	'localhost:8000'
3. click 'allow' to allow microphone access

### How it works

Jarvis can be instantiated with command/callback pairs by the developer to suit their app and they are stored in the 'commandsList' object.  

1. Jarvis listens for the user to speak a sentence.
2. An api request is made to wit.ai with the sentence in string form. 
3. Wit.ai response with relevate data such as 'intent', 'location', 'query', 'places_key', 'local_search_query'.
4. If any of these 'intents' match to a command in the 'commandsList', the callback function is passed wit's response data and invoked. 

I chose to send the command in string format because it was more efficient than sending the entire audio file to Wit.ai and the browser is usually accurate in understanding the user. 

### Example
	var queryYahoo = function(data) {
		//send ajax request to yahoo with the data
	};
		//when wit returns that the intent is to 'navigate_places', the queryYahoo method is called
	var commands = {
		'navigate_places': queryYahoo
	};
		//add the list of commands 
	Jarvis.addCommands(commands);	

	Jarvis.start('token');

	** Now anytime a voice command is analyzed, and wit.ai returns that the 'intent' is 'navigate places', queryYahoo will be invoked with the response from wit.ai.


### TODO with more time

1. Use a front-end framework, Angular.js or React.js. I usually use Angular, but would really like to experiment with React.js
2. More tests, particulary integration to emphasize TDD in my development.
3. Add functionality to get directions as well as display a map.
4. Setup Grunt/Gulp dev environment for further development efficiency.
5. Train wit.ai with more example cases for better speech recognition OR use a much better recognition api. eg 'Where can I get a salad in San Francisco'. Wit.ai returns the query as 'a salad' and location as 'San Francisco' and yahoo returns no results for 'a salad'.
6. Get a SSL to avoid user constantly having to click allow access to microphone. The browser randomly closes the session for some unknown reason.
7. Voice response was implemented at one point, but sounded cheesy even with several different voices. Maybe a better implemenation or voice can be used. 
8. Maybe default to users current geo location as the default location in case there is not location paramenter returned from wit.ai.
9. Since jarvis is always listening, it picks up background noise, believes it is a command, and slows down user experience. Somehow make it less sensitive for increased accuracy.


