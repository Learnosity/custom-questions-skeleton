import ClockScorer from "scorer/index";

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
        score: 1,
        valid_response: {
            hourHandAngle: 45,
            minHandAngle: 90,
        },
    },
};
let scorer;

describe("ClockScorer", () => {
    afterEach(teardown);

    describe("has isValid method", () => {
        it("should return true provided that response object is the same as provided question.valid_response object", () => {
            const mockValidResponseValue = {
                hourHandAngle: 45,
                minHandAngle: 90,
            };
            setup({
                question: {
                    valid_response: mockValidResponseValue
                },
                response: mockValidResponseValue
           });

            expect(scorer.isValid()).toEqual(true);
        });
        it('should return false if provided response object is different than the provided question.valid_response object by plus or minus the TOLERANCE of 7 degrees', () => {
            const mockValidResponseValue = {
                hourHandAngle: 45,
                minHandAngle: 90,
            };
            const mockIncorrectResponseValue = {
                hourHandAngle: 55,
                minHandAngle: 100,
            };
            setup({
                question: {
                    valid_response: mockValidResponseValue
                },
                response: mockIncorrectResponseValue
           });

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

    scorer = new ClockScorer(question, response);

    return scorer;
}

function teardown() {
    scorer = null;
}
