import { get } from 'lodash';
import BoxAndWhisker from './components/boxAndWhisker';
import { CLASS_NAMES } from './constants';

export default class BoxAndWhiskerQuestion {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        this.render().then(() =>{
            this.registerPublicMethods();
            this.handleEvents();

            if (init.state === 'review') {
                init.getFacade().disable();
            }

            init.events.trigger('ready');
        });
    }

    render() {
        const { el, init, lrnUtils } = this;
        const { question, response } = init;

        el.innerHTML = `
            <div class="lrn-bnw lrn-response-validation-wrapper">
                <div class="lrn_response_input">
                    <svg></svg>
                </div>            
                <div class="lrn-bnw-checkAnswer-wrapper"></div>
                <div class="lrn-bnw-suggestedAnswers-wrapper"></div>
            </div>
        `;

        // Render necessary Learnosity components first before rendering our Box and Whisker
        return Promise.all([
            lrnUtils.renderComponent('SuggestedAnswersList', el.querySelector('.lrn-bnw-suggestedAnswers-wrapper')),
            lrnUtils.renderComponent('CheckAnswerButton', el.querySelector('.lrn-bnw-checkAnswer-wrapper'))
        ]).then(([suggestedAnswersList]) => {
            this.suggestedAnswersList = suggestedAnswersList;
            this.bnw = new BoxAndWhisker(el.querySelector('svg'), {
                question,
                response
            });

            this.bnw.render();
        });
    }

    registerPublicMethods() {
        const { init, bnw } = this;
        const facade = init.getFacade();

        facade.disable = () => {
            if (bnw) {
                bnw.disable();
            }
        };
        facade.enable = () => {
            if (bnw) {
                bnw.enable();
            }
        };
    }

    handleEvents() {
        const { el, events, init, bnw, suggestedAnswersList } = this;
        const responseInputElement = el.querySelector('.lrn_response_input');

        bnw.registerEvents({
            onChange(responses) {
                events.trigger('changed', responses);
            },
            onValidationUICleared() {
                if (suggestedAnswersList) {
                    suggestedAnswersList.reset();
                }

                responseInputElement.classList.remove(CLASS_NAMES.CORRECT, CLASS_NAMES.INCORRECT);
            }
        });

        // "validate" event can be triggered when Check Answer button is clicked or when public method .validate() is called
        // so developer needs to listen to this event to decide if he wants to display the correct answers to user or not
        // options.showCorrectAnswers will tell if correct answers for this question should be display or not.
        // The value showCorrectAnswers by default is the value of showCorrectAnswers inside initOptions object that is used
        // to initialize question app or the value of the options that is passed into public method validate (like question.validate({showCorrectAnswers: false}))
        events.on('validate', options => {
            const detailedValidatedResult = init.getFacade().isValid(true);

            bnw.clearValidationUI();
            bnw.renderValidationUI(detailedValidatedResult);

            if (detailedValidatedResult.correct) {
                responseInputElement.classList.add(CLASS_NAMES.CORRECT);
            } else {
                responseInputElement.classList.add(CLASS_NAMES.INCORRECT);

                const validationValue = get(init.question, 'valid_response.value') || {};

                if (options.showCorrectAnswers && suggestedAnswersList) {
                    suggestedAnswersList.reset();
                    suggestedAnswersList.setAnswers([
                        { index: 0, label: `Min: ${validationValue.min}`},
                        { index: 1, label: `Quartile 1: ${validationValue.quartile_1}`},
                        { index: 2, label: `Median: ${validationValue.median}`},
                        { index: 3, label: `Quartile 3: ${validationValue.quartile_3}`},
                        { index: 4, label: `Max: ${validationValue.max}`}
                    ]);
                }
            }
        });
    }
}
