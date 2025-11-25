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
        instant_feedback: true
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
