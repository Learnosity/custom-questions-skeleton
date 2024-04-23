This demo has been developed to demonstrate how to utilize custom events and methods in a custom question.
```
// To create custom pub / sub events
const { init } = this;
const { events } = init;
const facade = init.getFacade();
facade.customEvents = {
    once: events.once,
    on: events.on,
    off: events.off,
    trigger: events.trigger,
};

// To trigger custom events
facade.customEvents.trigger('customEventName', { data: 'some data' });

// To subscribe to custom events
const question = questionsApp.question('response_id_of_custom_question');
question.customEvents.on('customEventName', (data) => {
    console.log(data);
});

// To register custom methods
facade.customMethods = {
    customMethod: (data) => {
        console.log(data);
    },
};
// To call custom methods
question.customMethods.customMethod({ data: 'some data' });
```

## Key Files

#### Javascript and CSS
* `src/question/index.js` - Frontend javascript code for developing the UI of your custom question. All logic related to rendering your custom quesiton UI should go here. 

#### JSON
* `question.json` - REQUIRED. This file is for creating the JSON definition of your custom question to be stored inside of Learnosity. (This JSON definition is your own definition for your own question, similar to the JSON defition for out of the box Learnosity questions like a multiple choice quesiton.):

https://reference.learnosity.com/questions-api/questiontypes#mcq



#### php

These php files are development scafolding files and their purpose is to emulate the Learnosity production environment during development so as to model how your custom question will behave as a first class citizen across the Learnosity ecosystem from Authoring to Assessmnet to Analytics, just like any out of the box Learnosity question type.

You can therefore think of these files as a "development-server" whose language happens to be php. You don't need to make any changes to these files unless you want to. They automatically injest the JSON you create in the above 2 files.

* `assessment.php` - For modeling how your custom question will behave in a Learnosity Assessment. 
    Available at `localhost:12345/assessmnet.php`.

## Available Scripts
* Start the localhost server to start developing your custom question
```
yarn dev
```
* Bundle the production ready code of your custom question. 
Once your custom question is ready, run this script and host the resulant `question.js`, `scorer.js`, `question.css` and `authoring_custom_layout.html` files on your server.

The paths to these files can be easily managed and aliased via the custom questions module on our self-service site, console.learnosity.com:

https://help.learnosity.com/hc/en-us/articles/360000756198-Console-Overview#custom-questions


```
yarn prod
```
* Test your scorer's behavior in the server side. Update question/response in `debugServerScorer.js` to test
```
yarn debug-server-scorer
```
* run unit tests for your custom question
```
yarn unit-tests
```
