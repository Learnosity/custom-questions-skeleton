import CustomQuestionScorer from "scorer/index";

const dataProvider = {
    question: {
        response_id: "custom-clock-a0352aea-6d54-426f-b906-61cac93ac1d3",
        type: "custom",
        stimulus:
            "Oh no! The hands on the clock have gotten all messed up! Help fix the clock by moving the hands to show what time it is! <br><strong>Drag the hands to show 4:30 on the clock.</strong>",
        js: {
            question: "/dist/question.js",
            scorer: "/dist/scorer.js",
        },
        css: "/dist/question.css",
        instant_feedback: true,
        max_score: 1,
        valid_response: {
            hourHandAngle: 45,
            minHandAngle: 90,
        },
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
