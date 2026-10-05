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
                score: 1,
                value: 'the correct answer'
            }
        }
    },
    response: {
        value: null
    }
};
let scorer;

describe('CustomQuestionScorer', () => {
    afterEach(teardown);

    describe('has isValid method', () => {
        it('should return false', () => {
            setup();

            expect(scorer.isValid()).toEqual(false);
        });
    });

    describe('has maxScore method', () => {
        it('should read the score from the validation object', () => {
            setup();

            expect(scorer.maxScore()).toEqual(1);
        });

        it('should return 0 when no validation object is configured', () => {
            setup({ question: { validation: undefined } });

            expect(scorer.maxScore()).toEqual(0);
        });
    });

    describe('has canValidateResponse method', () => {
        it('should return true when a valid response value is configured', () => {
            setup();

            expect(scorer.canValidateResponse()).toEqual(true);
        });

        it('should return false when no valid response value is configured', () => {
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
    const response = {
        ...dataProvider.response,
        ...options.response
    };

    scorer = new CustomQuestionScorer(question, response);

    return scorer;
}

function teardown() {
    scorer = null;
}
