<p align="center"><img width="50%" height="50%" src="images/image-logo-graphic.png"></p>
<h1 align="center">Guidelines for Learnosity Custom Questions and Features</h1>
<p align="center">The guideline you need to start building your custom question/feature with Learnosity APIs using your preferred toolkit and languages.<br> 
</p>
<p align="center">More Custom Questions documentation is available at the <a href="https://help.learnosity.com/hc/en-us/sections/4412969135761-Creating-Custom-Questions-and-Features">Learnosity Help Site</a><br>
  An official Learnosity open-source project.</p>
  
---

## Table of Contents

* [Overview: what does it contain?](#overview-what-does-it-contain)
* [Available Demo Scripts](#available-demo-scripts)
* [Test your Custom Question](#test-your-custom-question)
* [Publish your custom question](#publish-your-custom-question)
* [Development Recommendations](#development-recommendations)
* [Next steps: additional documentation](#next-steps-additional-documentation)
* [Contributing to this project](#contributing-to-this-project)
* [License](#license)

## Overview: what does it contain?
The Learnosity Custom Question/Feature Guideline provides the complete demos of some custom questions/features
built by Learnosity engineers which you can use as a base of your custom question/feature project.

Following demos have been included in this repository:
* Box and whisker
* Custom question skeleton

Each demo will have the following structure:
* `package.json`: contains the information about your custom question/feature project.
  This file also contains some handy `scripts` that you can execute to quickly develop your custom question/feature.
* `webpack.config.js`: is used to transpile and bundle your custom question/feature code.
* `assessment.php`: a local Assessment demo page to help you to develop your custom question/feature quickly.
* `authoring.php`: a local Assessment demo page to help you to develop the Schemas and Authoring layout for your custom question/feature.
* `authoring_custom_layout.html`: the Authoring HTML layout of your custom question/feature
* `debugServerScorer.js`: a local Assessment server side demo page to help you to test the behavior of your custom question's scorer in the server side locally.
* `src`: the source code folder
  * `src/question.js`: the frontend entry point of your custom question/feature.
    This file is responsible to generate the UI in the browser of you custom question/feature. 
  * `src/scorer.js`: the server side entry point of your custom question/feature.
    This file is responsible to score the stored response of your custom question/feature and should not contain any UI related or any DOM manipulation libraries.
* `scss`: the SASS source code folder

## Available Demo Scripts
**1. Box and Whisker Demo**
* Project Location: `demos/box-and-whisker`

**2. Custom Question Skeleton Demo**
* A clean custom question skeleton you can leverage to start working on your custom question 
* Project Location: `demos/custom-question-skeleton`

**Scripts**
```
# Start the localhost server to start developing your custom question
yarn dev

# Build the production ready code of your custom question
yarn prod

# Test your scorer's behavior in the server side. Update question/response in debugeServerScorer.js to test
yarn debug-server-scorer

# Run Jest unit-tests
yarn unit-tests

# Run Jest unit-tests in watch mode
yarn unit-tests-watch
```

## Test your custom question
Assessment demo using Questions API: 
http://localhost:12345/assessment.php

Authoring demo using Author API: 
http://localhost:12345/authoring.php

## Publish your custom question
* Once your custom question is ready, run `yarn prod` to generate the production ready build then
copy the content of the `dist` folder and your `authoring_custom_layout.html` to your server and
make sure those files are accessible on the web.
* To test your production build, in your `assessment.php` file, point the `js` and `css` files to the location of your files
```
"js": {
  "question": "YOUR-SERVER-URL/question.js",
  "scorer": "YOUR-SERVER-URL/scorer.js"
},
"css": "YOUR-SERVER-URL/question.css"
```

## Development Recommendations
**1. Leverage predefined Learnosity components**

Avoid building the following default components to keep the consistent look-and-feel with Learnosity UI 
* **Check Answer button**
  * Syntax: `lrnUtils.renderComponent('CheckAnswerButton', wrapperElement)`
  * ```
    // Example:
    export default class MyCustomQuestion {
        constructor(init, lrnUtils) {
          const checkAnswerWrapperElement = document.createElement('DIV');
    
          init.el.appendChild(checkAnswerWrapperElement);
    
          this.checkAnswerButton = lrnUtils.renderComponent('CheckAnswerButton', checkAnswerWrapperElement);
          ...
        }
    ```
  * Public methods:
    * `remove()`: Remove the component
      * ```
        this.checkAnswerButton = lrnUtils.renderComponent('CheckAnswerButton', checkAnswerWrapperElement);
        this.checkAnswerButton.remove();
        ```

* **Suggested Answers list**
* Syntax: `lrnUtils.renderComponent('SuggestedAnswersList', wrapperElement)`
  * ```
    // Example:
    export default class MyCustomQuestion {
        constructor(init, lrnUtils) {
          const checkAnswerWrapperElement = document.createElement('DIV');
    
          init.el.appendChild(suggestedListWrapperElement);
    
          this.suggestedAnswersList = lrnUtils.renderComponent('SuggestedAnswersList', suggestedListWrapperElement);
          ...
        }
    ```
  * Public methods:
    * `remove()`: Remove the component
      * ```
        this.suggestedAnswersList = lrnUtils.renderComponent('SuggestedAnswersList', suggestedListWrapperElement);
        this.checkAnswerButton.remove();
        ```
    * `reset()`: Reset the components to its default state. All rendered answers will be removed.
      * ```
        this.suggestedAnswersList = lrnUtils.renderComponent('SuggestedAnswersList', suggestedListWrapperElement);
        this.checkAnswerButton.reset();
        ```
    * `setAnswers(Array<{ index: number, label: string }>)`: Render the answers based on provided array
      * ```
        this.suggestedAnswersList = lrnUtils.renderComponent('SuggestedAnswersList', suggestedListWrapperElement);
        this.suggestedAnswersList.setAnswers([
            { index: 0, label: 'A'},
            { index: 1, label: 'B'},
            { index: 2, label: 'C'}
        ]);
        ```

**2. Leverage predefined Learnosity style**

You can leverage the predefined validation UI style of Learnosity API by wrapping your custom question/feature content
under the DOM structure below
```
<div class="lrn-bnw lrn-response-validation-wrapper">
    <div class="lrn_response_input">
        RENDER YOUR CUSTOM QUESTION/FEATURE ELEMENT IN HERE
    </div>            
</div>
```

Adding `lrn_correct` (when all correct answers are provided) or `lrn_incorrect` (when the provided answer is not correct)
to `lrn_response_input` will render the proper validation UI state to your custom question/feature.

## Next steps: additional documentation
You can find more detailed documentation in the [Learnosity Help site](https://help.learnosity.com/hc/en-us/sections/4412969135761-Creating-Custom-Questions-and-Features).
If you are new to Learnosity Custom Questions we highly recommend starting [here](https://help.learnosity.com/hc/en-us/articles/4414363148561-Getting-Started-with-Custom-Questions-and-Features).

## Contributing to this project

### Adding new features or fixing bugs
Contribution in the form of [Issues] and [PRs] are welcome.

[(Back to top)](#table-of-contents)

## License
This project is licensed under MIT License. [Read more](LICENSE.md).

[(Back to top)](#table-of-contents)
