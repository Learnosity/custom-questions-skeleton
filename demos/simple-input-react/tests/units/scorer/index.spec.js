import CustomQuestionScorer from 'scorer/index';

const dataProvider = {
    question: {
        type: 'custom',
        stimulus: 'Stimulus of the custom question',
        js: {
            question: '/dist/question.js',
            scorer: '/dist/scorer.js'
        },
        css: '/dist/question.css',
        instant_feedback: true,
        validation: {
            valid_response: {
                value: 'Sydney',
                score: 3
            }
        }
    },
    responseValue: null
};
let scorer;

describe('CustomQuestionScorer', () => {
    afterEach(teardown);

    describe('has isValid method', () => {
        it('should return false when there is no response', () => {
            setup();

            expect(scorer.isValid()).toEqual(false);
        });

        it('should return true when the response matches validation.valid_response.value', () => {
            setup({ responseValue: 'Sydney' });

            expect(scorer.isValid()).toEqual(true);
        });

        it('should return false when the response does not match', () => {
            setup({ responseValue: 'Melbourne' });

            expect(scorer.isValid()).toEqual(false);
        });
    });

    describe('has maxScore method', () => {
        it('should read the score from validation.valid_response.score', () => {
            setup();

            expect(scorer.maxScore()).toEqual(3);
        });

        it('should return 0 when no validation object is configured', () => {
            setup({ question: { validation: undefined } });

            expect(scorer.maxScore()).toEqual(0);
        });
    });

    describe('has canValidateResponse method', () => {
        it('should return true when a validation object is configured', () => {
            setup();

            expect(scorer.canValidateResponse()).toEqual(true);
        });

        it('should return false when no validation object is configured', () => {
            setup({ question: { validation: undefined } });

            expect(scorer.canValidateResponse()).toEqual(false);
        });
    });
});

function setup(options = {}) {
    const question = {
        ...dataProvider.question,
        ...options.question
    };
    const responseValue = 'responseValue' in options
        ? options.responseValue
        : dataProvider.responseValue;

    scorer = new CustomQuestionScorer(question, responseValue);

    return scorer;
}

function teardown() {
    scorer = null;
}
