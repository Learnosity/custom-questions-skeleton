This skeleton has been developed as a proof of concept using our most commmon environment. 

## Key Files

#### Javascript and CSS

* `src/question/index.js` - Frontend javascript code for developing the UI of your custom question. All logic related to rendering your custom quesiton UI should go here. 
* `src/scorer/index.js` -  Javascript code for developing the scoring logic of your custom question. This code will be run on the server-side when your custom question is scored in Learnosity. 

* `scss/_question.scss` - for writing CSS styling rules to be applied to your custom quesiton UI.

#### JSON
* `question.json` - REQUIRED. This file is for creating the JSON definition of your custom question to be stored inside of Learnosity. (This JSON definition is your own definition for your own question, similar to the JSON defition for out of the box Learnosity questions like a multiple choice quesiton.):

https://reference.learnosity.com/questions-api/questiontypes#mcq


* `question_editor_init_options.json` - OPTIONAL. Required only if you intend for new instances of your custom question to be authorable via the Learnosity question editor UI. Please see our help article on How to Create A Custom Question Authoring Tile for more detail:

https://help.learnosity.com/hc/en-us/articles/360000755098-Authoring-Custom-Questions-Features#how-to-create-custom-question--feature-custom-tile-items

### html

 * `authoring_custom_layout.html` - If you intend to make your custom question available to authors, this file is for defining the question editor UI layout and appearance for authors who create new instances of your custom question. 

 This is similar to the question editor html layout for out of the box Learnosity questions, like a multiple choice question:
 https://reference.learnosity.com/products/questioneditor-api/downloadeditorlayout.php?widget=mcq
 

#### php

These php files are development scafolding files and their purpose is to emulate the Learnosity production environment during development so as to model how your custom question will behave as a first class citizen across the Learnosity ecosystem from Authoring to Assessmnet to Analytics, just like any out of the box Learnosity question type.

You can therefore think of these files as a "development-server" whose language happens to be php. You don't need to make any changes to these files unless you want to. They automatically injest the JSON you create in the above 2 files.

* `assessment.php` - For modeling how your custom question will behave in a Learnosity Assessment. 
    Available at `localhost:12345/assessmnet.php`.

* `authoring.php`- If you intend to make your custom question available to authors, navigate to this file to model how your custom question will behave on the Author Site or standalone Author API. 
    Available at `localhost:12345/authoring.php`



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
