import UnitConverterScorer from 'scorer/index';

// Base question fixture — resolved for row id_0: 100 cm → m, answer: 1
const baseQuestion = {
    type: 'custom',
    fromValue: '100',
    fromUnit: 'cm',
    toUnit: 'm',
    validation: {
        valid_response: {
            score: 1,
            value: '1'
        }
    }
};

let scorer;

function setup({ question = {}, responseValue = null } = {}) {
    scorer = new UnitConverterScorer({ ...baseQuestion, ...question }, responseValue);
    return scorer;
}

function teardown() {
    scorer = null;
}

describe('UnitConverterScorer', () => {
    afterEach(teardown);

    // ------------------------------------------------------------------ isValid
    describe('isValid()', () => {
        it('returns true when the response matches the correct answer exactly', () => {
            setup({ responseValue: '1' });
            expect(scorer.isValid()).toBe(true);
        });

        it('returns true when the response matches numerically (e.g. "1.0" vs "1")', () => {
            setup({ responseValue: '1.0' });
            expect(scorer.isValid()).toBe(true);
        });

        it('returns false when the response is wrong', () => {
            setup({ responseValue: '100' });
            expect(scorer.isValid()).toBe(false);
        });

        it('returns false when the response is null', () => {
            setup({ responseValue: null });
            expect(scorer.isValid()).toBe(false);
        });

        it('returns false when the response is an empty string', () => {
            setup({ responseValue: '' });
            expect(scorer.isValid()).toBe(false);
        });

        it('returns false when there is no valid_response in the question', () => {
            setup({ question: { validation: null }, responseValue: '1' });
            expect(scorer.isValid()).toBe(false);
        });
    });

    // ------------------------------------------------------------------ score
    describe('score()', () => {
        it('returns maxScore when the response is valid', () => {
            setup({ responseValue: '1' });
            expect(scorer.score()).toBe(1);
        });

        it('returns 0 when the response is invalid', () => {
            setup({ responseValue: '999' });
            expect(scorer.score()).toBe(0);
        });

        it('returns 0 when there is no response', () => {
            setup({ responseValue: null });
            expect(scorer.score()).toBe(0);
        });
    });

    // ------------------------------------------------------------------ maxScore
    describe('maxScore()', () => {
        it('returns the score from valid_response', () => {
            setup();
            expect(scorer.maxScore()).toBe(1);
        });

        it('falls back to 1 when valid_response.score is absent', () => {
            setup({ question: { validation: { valid_response: { value: '1' } } } });
            expect(scorer.maxScore()).toBe(1);
        });
    });

    // ------------------------------------------------------------------ canValidateResponse
    describe('canValidateResponse()', () => {
        it('returns true when valid_response has a value', () => {
            setup();
            expect(scorer.canValidateResponse()).toBe(true);
        });

        it('returns false when there is no validation on the question', () => {
            setup({ question: { validation: null } });
            expect(scorer.canValidateResponse()).toBe(false);
        });
    });

    // ------------------------------------------------------------------ dynamic content: per-attempt scoring
    describe('per-attempt scoring (dynamic content rows)', () => {
        it('scores correctly when question is resolved for a different row (km → m)', () => {
            const kmQuestion = {
                ...baseQuestion,
                fromValue: '5',
                fromUnit: 'km',
                toUnit: 'm',
                validation: { valid_response: { score: 1, value: '5000' } }
            };

            setup({ question: kmQuestion, responseValue: '5000' });
            expect(scorer.isValid()).toBe(true);
            expect(scorer.score()).toBe(1);
        });

        it('returns false for the correct answer of a different row', () => {
            // Correct answer for id_0 (cm→m) is "1", but this question is for id_1 (km→m)
            const kmQuestion = {
                ...baseQuestion,
                fromValue: '5',
                fromUnit: 'km',
                toUnit: 'm',
                validation: { valid_response: { score: 1, value: '5000' } }
            };

            setup({ question: kmQuestion, responseValue: '1' });
            expect(scorer.isValid()).toBe(false);
            expect(scorer.score()).toBe(0);
        });
    });
});
