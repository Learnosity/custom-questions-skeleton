import sinon from 'sinon';
import { noop } from 'lodash';
import ee from 'event-emitter';
import BoxAndWhiskerQuestion from 'question/index';

const dataProvider = {
    question: {
        type: 'custom',
        stimulus: 'Draw a <b>box &amp; whisker</b> chart for the following: <b>6, 2, 5, 3, 6, 10, 11, 6</b>',
        js: {
            question: '/dist/question.js',
            scorer: '/dist/scorer.js'
        },
        css: '/dist/question.css',
        line_min: 1,
        line_max: 19,
        step: 1,
        min: 2,
        max: 14,
        quartile_1: 4,
        median: 6,
        quartile_3: 10,
        score: 1,
        valid_response: {
            value: {
                min: 4,
                max: 8,
                quartile_1: 5,
                median: 6,
                quartile_3: 7
            }
        },
        instant_feedback: true
    },
    response: {
        value: {
            min: 4,
            max: 8,
            quartile_1: 5,
            median: 6,
            quartile_3: 7
        }
    }
};
let question;

describe('BoxAndWhiskerQuestion', () => {
    describe('during initialization', () => {
        it('should call render', () => {
            const spy = sinon.spy(BoxAndWhiskerQuestion.prototype, 'render');

            setup();

            expect(spy.calledOnce).toEqual(true);
        });

        describe('once render is resolved', () => {
            it('should call registerPublicMethods', (done) => {
                const spy = sinon.spy(BoxAndWhiskerQuestion.prototype, 'registerPublicMethods');

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

        it('should append a div.lrn-bnw to the main element el of the question instance', () => {
            expect(question.el.querySelectorAll('.lrn-bnw').length).toEqual(1);
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

    question = new BoxAndWhiskerQuestion(init, lrnUtils);
}

function teardown() {
    sinon.restore();
    question = null;
}
