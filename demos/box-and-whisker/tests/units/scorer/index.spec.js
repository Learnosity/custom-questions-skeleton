import BoxAndWhiskerScorer from 'scorer/index';

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
let scorer;

describe('BoxAndWhiskerScorer', () => {
    afterEach(teardown);

    describe('has isValid method', () => {
        it('should return true if provided response.value is the same as provided question.valid_response.value', () => {
            const mockValidResponseValue = {
                min: 4,
                max: 8,
                quartile_1: 5,
                median: 6,
                quartile_3: 7
            };

            setup({
                question: {
                    valid_response: {
                        value: mockValidResponseValue
                    }
                },
                response: {
                    value: mockValidResponseValue
                }
            });

            expect(scorer.isValid()).toEqual(true);
        });

        it('should return false if provided response.value is different than the provided question.valid_response.value', () => {
            setup({
                question: {
                    valid_response: {
                        value: {
                            min: 4,
                            max: 8
                        }
                    }
                },
                response: {
                    value: null
                }
            });

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

    scorer = new BoxAndWhiskerScorer(question, response);

    return scorer;
}

function teardown() {
    scorer = null;
}
