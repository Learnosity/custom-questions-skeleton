import sinon from 'sinon';
import { noop } from 'lodash';
import ee from 'event-emitter';
import CustomQuestion from 'question/index';

const dataProvider = {
    question: {
        type: 'custom',
        stimulus: 'Stimulus of the custom question',
        js: {
            question: '/dist/question.js',
            scorer: '/dist/scorer.js'
        },
        css: '/dist/question.css',
        instant_feedback: true
    },
    response: {
        value: null
    }
};
let question;

describe('CustomQuestion', () => {
    describe('during initialization', () => {
        it('should call render', () => {
            const spy = sinon.spy(CustomQuestion.prototype, 'render');

            setup();

            expect(spy.calledOnce).toEqual(true);
        });

        describe('once render is resolved', () => {
            it('should call registerPublicMethods', (done) => {
                const spy = sinon.spy(CustomQuestion.prototype, 'registerPublicMethods');

                setup();

                // Wait for render() promise to resolve
                setTimeout(() => {
                    expect(spy.calledOnce).toEqual(true);
                    done();
                }, 1);
            });
        });
    });

    describe('has render method', () => {
        beforeEach(() => {
            setup();
        });

        it('should append a div.lrn-response-validation-wrapper to the main element el of the question instance', () => {
            expect(question.el.querySelectorAll('.lrn-response-validation-wrapper').length).toEqual(1);
        });
    });
});

function setup(options = {}) {
    const emitter = ee();
    const element = document.createElement('DIV');
    const facade = {
        isValid: noop
    };
    const init = {
        question: {
            ...dataProvider.question,
            ...options.question
        },
        response: options.response,
        $el: {
            get: () => element
        },
        events: {
            trigger: emitter.emit,
            on: emitter.on,
            once: emitter.once,
            off: emitter.off
        },
        getFacade: () => facade,
        ...options.init
    };
    const lrnUtils = {
        renderComponent: (componentName) => {
            return new Promise((resolve) => {
                if (componentName === 'SuggestedAnswersList') {
                    resolve({
                        reset: noop,
                        setAnswers: noop
                    });

                    return;
                }

                resolve(null);
            });
        }
    };

    question = new CustomQuestion(init, lrnUtils);
}

function teardown() {
    sinon.restore();
    question = null;
}
