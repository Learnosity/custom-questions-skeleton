<p align="center"><img width="50%" height="50%" src="images/image-logo-graphic.png"></p>
<h1 align="center">Learnosity Custom Question/Feature Guideline</h1>
<p align="center">The guideline you need to start building your custom question/feature with Learnosity APIs using your preferred toolkit and languages.<br> 
<br>
An official Learnosity open-source project.</p>
---

## Table of Contents

* [Overview: what does it contain?](#overview-what-does-it-contain)
* [Available Demo Scripts](#available-demo-scripts)
* [Development Recommendation](#development-recommendation)
* [Next steps: additional documentation](#next-steps-additional-documentation)
* [Contributing to this project](#contributing-to-this-project)
* [License](#license)
* [Usage tracking](#usage-tracking)
* [Further reading](#further-reading)


## Overview: what does it contain?
The Learnosity Custom Question/Feature Guideline provides the complete demos of some custom questions/features
built by Learnosity engineers which you can use as a base of your custom question/feature project.

Following demos have been included in this repository:
* Box and whisker

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
* Scripts:
```
# Start the localhost server to start developing your custom question
yarn dev
# Build the production ready code of your custom question
yarn prod
# Test your scorer's behavior in the server side. Update question/response in debugeServerScorer.js to test
yarn debug-server-scorer
```

## Development Recommendation
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