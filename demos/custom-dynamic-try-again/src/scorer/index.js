/**
 * UnitConverterScorer
 *
 * Receives:
 *   question     — resolved question JSON for the current attempt.
 *                  All {{var:x}} placeholders have been substituted by the platform
 *                  before this constructor is called, so question.validation.valid_response.value
 *                  already contains the correct numeric answer as a string (e.g. "5000").
 *   responseValue — the raw value the student entered (string from the input).
 *
 * For dynamic content try-again, the platform automatically wraps this scorer
 * to compute per-attempt scores when question.metadata.dynamic_content.try_again
 * .record_attempt_scores is true. Each attempt is scored by instantiating this
 * class with the resolved question for that specific row and the stored response
 * value for that attempt. No dynamic-content awareness is required here.
 */
export default class UnitConverterScorer {
    constructor(question, responseValue) {
        this.question = question;
        this.responseValue = responseValue;
        this.validResponse =
            question &&
            question.validation &&
            question.validation.valid_response;
    }

    /**
     * Returns true if the student's response matches the correct answer.
     * Compares as numbers so that "1.0" and "1" are treated as equal.
     */
    isValid() {
        const { responseValue, validResponse } = this;

        if (
            responseValue === null ||
            responseValue === undefined ||
            responseValue === '' ||
            !validResponse ||
            validResponse.value === undefined
        ) {
            return false;
        }

        const studentNum = parseFloat(responseValue);
        const correctNum = parseFloat(validResponse.value);

        return !isNaN(studentNum) && !isNaN(correctNum) && studentNum === correctNum;
    }

    validateIndividualResponses() {
        return this.isValid();
    }

    score() {
        return this.isValid() ? this.maxScore() : 0;
    }

    maxScore() {
        return (this.validResponse && this.validResponse.score) || 1;
    }

    canValidateResponse() {
        return !!(this.validResponse && this.validResponse.value !== undefined);
    }
}
