import CustomQuestionScorer from "scorer/index";

const dataProvider = {
    question: {
        response_id: "custom-piano-2f86da6f-c9bd-4df5-9660-203645da3c6c",
        type: "custom",
        stimulus:
            "<strong>Identify the notes of a C major chord on the piano. Any inversion is permissible. Click a key to hear the note.</strong>",
        js: {
            question: "/dist/question.js",
            scorer: "/dist/scorer.js",
        },
        css: "/dist/question.css",
        instant_feedback: true,
        valid_response: {
            notes: ["C", "E", "G"],
            indecies: [0, 4, 7],
        },
        max_score: 1,
    },
};
let scorer;

describe("CustomQuestionScorer", () => {
    afterEach(teardown);

    describe("has isValid method", () => {
        it("should return false", () => {
            setup();

            expect(scorer.isValid()).toEqual(false);
        });
    });
});

function setup(options = {}) {
    const question = {
        ...dataProvider.question,
        ...options.question,
    };
    const response = {
        ...dataProvider.response,
        ...options.response,
    };

    scorer = new CustomQuestionScorer(question, response);

    return scorer;
}

function teardown() {
    scorer = null;
}
