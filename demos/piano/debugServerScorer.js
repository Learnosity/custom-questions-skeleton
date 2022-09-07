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
        stimulus: "<h3>Identify the notes of a C major chord on the piano</h3>",
        response_id: "custom-piano-response-id",
        type: "custom",
        js: {
            question: "/dist/question.js",
            scorer: "/dist/scorer.js",
        },
        css: "/dist/question.css",
        instant_feedback: true,
        // TODO - requires implementation - add the rest of your question json
        valid_response: {
            value: ["C", "E", "G"],
        },
    },
    response: {
        // TODO - Requires implementation - the shape of your question response
        value: ["C", "E", "G"],
    },
};

// Path to the scorer file that you need to debug
const scorerUrl = "./dist/scorer.js";

// Mock LearnosityAmd object that will be used to transform the scorer into a class that we can use to debug later on
global.LearnosityAmd = {
    define: ([], resolveCallback) => {
        if (!resolveCallback) {
            throw new Error("No callback to resolve Scorer exists");
        }

        const result = resolveCallback();

        if (!result.Scorer) {
            throw new Error("No Scorer class");
        }

        runTest(
            result.Scorer,
            questionResponseJson.question,
            questionResponseJson.response
        );
    },
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

    console.log("isValid:", scorer.isValid());
    console.log(
        "validateIndividualResponses:",
        scorer.validateIndividualResponses()
    );
    console.log("score:", scorer.score());
    console.log("score:", scorer.maxScore());
}
