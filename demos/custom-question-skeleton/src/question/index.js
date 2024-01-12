import { EMBED_CLIENT_KEY, PREFIX } from './constants';

export default class Question {
    constructor(init, lrnUtils) {
      this.init = init;
      this.events = init.events;
      this.lrnUtils = lrnUtils;
      this.el = init.$el.get(0);

      this.runResult = init.response?.runResult;
      this.latestCode = init.response?.latestCode;

      this.render().then(() => {
        this.events.trigger("ready");
        this.registerPublicMethods();
        this.handleEvents();

        /**
         * @param { String } init.state - the state of Questions API.
         * state can be any of the following 3 strings
         * "initial" for first starting the assessment,
         * "resume" for coming back to a previously started assessment,
         * "review" for showing the completed assessment and results to the learner or teacher
         */

        if (init.state === "initial") {
        }
        else if (init.state === "resume") {
          if (this.latestCode && this.editor) {
            this.editor.setFileContents(this.latestCode.files);
          }
        }
        else if (init.state === "review") {
          if (this.runResult && this.editor) {
            this.editor.setFileContents(this.runResult.fileData.files);
          }

          init.getFacade().disable();
        }
      })
      .catch(err => {
        console.error("Embed failed to load:", err);
        this.events.trigger("ready");
      });
    }

    render() {
      const {init: {question: {challengeId, language}}} = this;
      const scriptSrc = "//www.qualified.io/embed.js";

      const renderError = s => {
        this.el.innerHTML = `
          <div class="alert alert-warning" role="alert">${s}</div>`;
        return Promise.resolve();
      };

      if (!EMBED_CLIENT_KEY) {
        return renderError("Configuration issue: Missing EMBED_CLIENT_KEY");
      }
      else if (!challengeId) {
        return renderError(`
          Please provide a Qualified Challenge ID (from the challenge's URL)
        `);
      }
      else if (!language || !language.trim()) {
        return renderError("Please provide a language");
      }

      let resolve;
      let reject;
      const embedLoaded = new Promise((resolve_, reject_) => {
        resolve = resolve_;
        reject = reject_;
      });
      const question = this;
      let firstOnChange = true;
      const timeout = setTimeout(() => {
        reject("Embed failed to load in 6 seconds");
      }, 6_000);
      const managerConfig = {
        options: {
          language,
          embedClientKey: EMBED_CLIENT_KEY,
          mode: this.init.state === "review" ? "readonly" : null,
          hideActions: this.init.state === "review",
          hideTabs: [],
        },
        onLoaded({manager, editor, challengeId, data}) {
          clearTimeout(timeout);
          resolve();
        },
        onChange({manager, editor, challengeId, data}) {
          if (firstOnChange) {
            firstOnChange = false;
            return;
          }

          question.latestCode = data;
          question.saveToLearnosity();
        },
        onRun({manager, editor, challengeId, data}) {
          if (
            data.type === "attempt" &&
            question.init.state !== "review"
          ) {
            question.runResult = data;
            question.saveToLearnosity();
          }
        }
      };

      if (document.querySelector(`script[src="${scriptSrc}"]`)) {
        this.createEmbedEditor(managerConfig, challengeId);
        return embedLoaded;
      }

      const script = document.createElement("script");
      script.addEventListener("load", () => {
        this.createEmbedEditor(managerConfig, challengeId);
      });
      script.src = scriptSrc;
      document.body.append(script);
      return embedLoaded;
    }

    createEmbedEditor(managerConfig, challengeId) {
      this.el.innerHTML = `
        <div class="${PREFIX} lrn-response-validation-wrapper">
          <div class="lrn_response_input">
            <div id="qualified-embed"></div>
          </div>
          <div class="${PREFIX}-checkAnswer-wrapper"></div>
          <div class="${PREFIX}-suggestedAnswers-wrapper"></div>
        </div>`;
      const manager = window.QualifiedEmbed.init(managerConfig);
      const node = document.querySelector("#qualified-embed");
      this.editor = manager.createEditor({
        node,
        challengeId,
      });
      const frame = node.querySelector("iframe");
      frame.style.width = "100%";
      frame.style.height = "400px";
    }

    saveToLearnosity() {
      this.events.trigger("changed", {
        runResult: this.runResult,
        latestCode: this.latestCode,
      });
    }

    /**
     * Add public methods to the created question instance that is accessible during runtime
     *
     * Example: questionsApp.question('my-custom-question-response-id').myNewMethod();
     * 
     */
    registerPublicMethods() {
        const { init } = this;
        // Attach the methods you want on this object
        const facade = init.getFacade();

        facade.disable = () => {
            // TODO: Requires implementation
            /**
             * The purpose of this method is to prevent learner interaction with your question's UI.
             * 
             * If you plan to display your custom question in "review" state, then you need to implement this
             * method to prevent a learner or instructor who is reviewing their completed results from being able to change the responses in your question UI.
             */

            // EXAMPLE implementation
            // document.getElementById('my-input').setAttribute('disabled', true)

        };
        facade.enable = () => {
            /**
             * The purpose of this method is to re-enable learner interaction with your question's UI
             * after it has been previously disabled.
             *               
             * (For example, you plan to temporarily disable the question UI for a student taking the assessment until they complete another task like spend a set time reading the instructions.)
             */

            // EXAMPLE implementation
            // document.getElementById('my-input').removeAttribute('disabled')
        };
        facade.resetResponse = () => {
            /**
             * The purpose of this method is to support removal of a previously entered response to your custom question
             * and restoring the question to its initial blank state before a response was entered.
             * (For example, in a multiple choice question where a student has picked a choice, you reset the question so that no choices are picked at all.)
             */

            // TODO: Requires implementation, you could use the following steps

            // trigger a 'resetResponse' event to reset the value of response
            // this.events.trigger('resetResponse');

            // reset other states if you need

            // re-render the component, manage the 'reset' state by yourself
        };
        facade.showValidationUI = () => {
            // TODO: requires implementation
            /**
             * The purpose of this method is to update your custom question's UI with visual feedback 
             * after the learner presses the Check Answer button.
             * 
             * The following is an example implementation that shows the standard Learnosity "checkmark / tick" for a correct answer
             * or the standard Learnosity "x mark / cross" for an incorrect answer. 
             */
            
            // EXAMPLE implemetation:

            // const answerIsCorrect = facade.isValid();
            // /**
            //  * update the UI based on the result
            //  * IMPORTANT: In both cases we need to target the element with the classname lrn_response_input
            //  */
            // if (answerIsCorrect) {
            //     /** if the answer is correct we will add the Learnosity utility class lrn_correct, which will automatically show the Learnosity
            //      * checkmark (tick) you are used to on regular Learnosity quesiton types
            //      */
            //     el.querySelector(".lrn_response_input").classList.add("lrn_correct");
            // } else {
            //     /** if the answer is incorrect we will add the Learnosity utility class lrn_incorrect, which will automatically show the Learnosity
            //      * x (cross) you are used to on regular Learnosity quesiton types
            //      */
            //     el.querySelector(".lrn_response_input").classList.add("lrn_incorrect");
            // }
                          
        };
        facade.resetValidationUI = () => {
            // TODO: requires implementation
            /**
             * If you implement showValidationUI() above, then you need to implement this method also.
             * 
             * If the user enters a response to your custom question, presses the Check Answer button, and then changes their response to something new,
             * you now need to remove the feedback UI that you had displayed for the previous response. This is exactly the purpose of this method.
             * 
             * The following is an example implementation that removes the standard Learnosity validation UI ("checkmark / tick" if the previous response was correct
             * or "x mark / cross" if the previous response was incorrect).
             */

            // Example implementation:

            // // we will remove the Learnosity checkmark or x previously showing
            // el.querySelector(".lrn_response_input").classList.remove("lrn_correct");
            // el.querySelector(".lrn_response_input").classList.remove("lrn_incorrect");
            
            // // if we chose to also display the correct answer, we will now remove the display of the correct answer as well by 
            // // leveraging the suggestedAnswersList.reset() method.
            // this.suggestedAnswersList.reset()
        };
    }

    handleEvents() {
        const { events, init } = this;
        const facade = init.getFacade()

        // TODO: Requires implementation - Make sure you trigger 'changed' event after the user changes their responses to your custom quesiton:

        /**
         * 
         * When you consider that the response to your question has been changed, 
         * (such when a user clicks the choice of a multiple choice question or enters text into a free response question),
         * then you must trigger the changed event to inform Questions API that the question has been attempted.
         * 
         * To do this, you must call events.trigger('changed', responses);  
         * This call should take place inside of a DOM event listener in which the user has changed their response to your question
         * (such as a 'click' event listener for a multiple choice question, or an input 'change' event listener for a free response text question)
         * 
         * @param responses The 'responses' variable can be any data type you would like it to be depending on the format of your custom question's responses. 
         * For instance, it might be a string for the value of a simple text input
         * Or for a quesiton asking a student to plot coorinates on a graph, it might be an object containing the x and y coordinates, e.g.
         *     {
         *       x: 123,
         *       y: 408
         *     }
         */

        /** EXAMPLE implementation
         * 
         * document.getElementById('my-radio-button').addEventListener('click', (event) => {
         *   
         *  // STEP 1: when the user clicks on your custom question's input, save its current value as the value of responses
         *  let responses = event.target.value
         *   
         *  // STEP 2: 
         *  // now notfy Questions API that the user has changed their response
         *   
         *   events.trigger('changed', responses);
         * 
         *  // STEP 3 - OPTIONAL
         *  // If you have chosen to implement facade.showValidationUI() above to display visiual feedback for a correct / incorrect answer
         *     when the user presses "Check Answer" for the current response:
         *     then make sure you have also implemented facade.resetValidationUI(), and that you call it here:
         * 
         * // facade.resetValidationUI()
         * 
         * })
         * 
         */


        // "validate" event can be triggered when Check Answer button is clicked or when public method .validate() is called
        // so developer needs to listen to this event to decide if he wants to display the correct answers to user or not
        // options.showCorrectAnswers will tell if correct answers for this question should be display or not.
        // The value showCorrectAnswers by default is the value of showCorrectAnswers inside initOptions object that is used
        // to initialize question app or the value of the options that is passed into public method validate (like question.validate({showCorrectAnswers: false}))
        events.on('validate', options => {
            // OPTIONAL Step 1: 
            //If you want to show changes to the UI for a correct or incorrect answer when the learner presses check answer
            // then make sure you have also implemented facade.showValidationUI(), and that you call it here:
            facade.showValidationUI()

            // OPTIONAL Step 2: 
            // If you want to display the correct answer to the learner when they press the Check Answer button,
            // then you should leverage the suggestedAnswersList.setAnswers() method. Please see the example implementation below for full details.

            // EXAMPLE Implementation 
            
            // if (!facade.isValid() && options.showCorrectAnswers) {
            //     // pass a string if there is a single correct answer 
            //     //OR:
            //     /**
            //     * For custom questions with multiple correct answers, you can also pass an array of objects into this method, 
            //     * each object containing an index key of type number for the 0-based index of the correct answer, 
            //     * and a label key of type string for the text of the correct answer. 
            //     * So, for a hypothetical question with 3 correct answers, you might pass the following array into setAnswers():

            //         [
            //          {index: 0, label: "correct answer 1"},
            //          {index: 1, label: "correct answer 2"},
            //          {index: 2, label: "correct answer 3"}
            //         ]

            //      */
                
            //     // EXAMPLE Implementation for a correct answer that is a string:
                
            //     // this.suggestedAnswersList.setAnswers(this.question.valid_response);
            // }

        });
    }
}
