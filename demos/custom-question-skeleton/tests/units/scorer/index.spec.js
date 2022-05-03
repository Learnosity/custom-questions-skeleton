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

describe('CustomQuestionScorer', () => {
    describe('has isValid method', () => {
        it('should return false', () => {
            const sut = setup();

            expect(sut.isValid()).toEqual(false);
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

    return new CustomQuestionScorer(question, response);
}