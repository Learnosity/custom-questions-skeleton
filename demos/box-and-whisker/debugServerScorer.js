console.log(`
==============================================================================================
THE SCRIPT BELOW IS BEING USED TO TEST THE SERVER SIDE SCORING FOR YOUR CUSTOM QUESTION
----
Update the questionResponseJson with your question json & response
==============================================================================================
`);

// QuestionResponseJson that will be used to test your Scorer logic
const questionResponseJson = {
    question: {
        response_id: 'box-and-whisker-response-id',
        stimulus: 'Draw a <b>box &amp; whisker</b> chart for the following: <b>6, 2, 5, 3, 6, 10, 11, 6</b>',
        type: 'custom',
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
            type: 'object',
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
        type: 'object',
        value: {
            min: 4,
            max: 8,
            quartile_1: 5,
            median: 6,
            quartile_3: 7
        }
    }
};

// Path to the scorer file that you need to debug
const scorerUrl = './dist/scorer.js';

// Mock LearnosityAmd object that will be used to transform the scorer into a class that we can use to debug later on
global.LearnosityAmd = {
    define: ([], resolveCallback) => {
        if (!resolveCallback) {
            throw new Error('No callback to resolve Scorer exists');
        }

        const result = resolveCallback();

        if (!result.Scorer) {
            throw new Error('No Scorer class');
        }

        runTest(result.Scorer, questionResponseJson.question, questionResponseJson.response);
    }
};

// Load the Scorer
require(scorerUrl);

function runTest(Scorer, question, response) {
    const scorer = new Scorer(question, response);

    console.log(`
**************
TEST OUTPUT
**************
    `);

    console.log('isValid:', scorer.isValid());
    console.log('validateIndividualResponses:', scorer.validateIndividualResponses());
    console.log('score:', scorer.score());
    console.log('score:', scorer.maxScore());
}
