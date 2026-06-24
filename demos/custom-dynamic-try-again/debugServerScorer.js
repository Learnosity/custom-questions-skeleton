console.log(`
==============================================================================================
Testing server-side scoring for the Unit Converter custom question.
Update questionResponseJson with your question and response to test.
==============================================================================================
`);

const questionResponseJson = {
    question: {
        type: 'custom',
        stimulus: 'Unit Conversion',
        fromValue: '100',
        fromUnit: 'cm',
        toUnit: 'm',
        js: {
            question: '/dist/question.js',
            scorer: '/dist/scorer.js'
        },
        css: '/dist/question.css',
        instant_feedback: true,
        validation: {
            valid_response: {
                score: 1,
                value: '1'
            }
        }
    },
    response: {
        value: '1'
    }
};

const scorerUrl = './dist/scorer.js';

global.LearnosityAmd = {
    define: (deps, resolveCallback) => {
        if (!resolveCallback) {
            throw new Error('No callback to resolve Scorer');
        }
        const result = resolveCallback();
        if (!result.Scorer) {
            throw new Error('No Scorer class exported');
        }
        runTest(result.Scorer, questionResponseJson.question, questionResponseJson.response.value);
    }
};

require(scorerUrl);

function runTest(Scorer, question, responseValue) {
    const scorer = new Scorer(question, responseValue);

    console.log('***** TEST OUTPUT *****');
    console.log('isValid:                 ', scorer.isValid());
    console.log('score:                   ', scorer.score());
    console.log('maxScore:                ', scorer.maxScore());
    console.log('canValidateResponse:     ', scorer.canValidateResponse());
    console.log('validateIndividualResponses:', scorer.validateIndividualResponses());
}
