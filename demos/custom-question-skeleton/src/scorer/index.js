export default class Scorer {
    constructor(question, response) {
        this.question = question;
        this.response = response;

        // The correct answer and its score live inside the question's `validation` object:
        //   question.validation.valid_response.value  -> the correct answer (any data type)
        //   question.validation.valid_response.score  -> points awarded for a correct answer
        this.validResponse = question
            && question.validation
            && question.validation.valid_response;
    }

    /**
     * Check if the current question's response is valid or not
     * (Required)
     * @returns {boolean}
     */
    isValid() {
        // TODO: Requires implementation
        // Compare this.response against this.validResponse.value

        return false;
    }

    /**
     * Returns an object displaying the validation state of each individual item inside the stored response
     * For example:
     * The student response value is: { min: 10, max: 20 } and our correct answer is { min: 10, max: 30 }
     * Then we expect the result of this validateIndividualResponses will be:
     * { min: true, max: false }
     * @returns {{}|null}
     */
    validateIndividualResponses() {
        // TODO: Requires implementation
        return null;
    }

    /**
     * Returns the score of the stored response
     * @returns {number|null}
     */
    score() {
        // TODO: Requires implementation
        return 0;
    }

    /**
     * Returns the possible max score of the stored response
     * @returns {number}
     */
    maxScore() {
        // The score is stored alongside the correct answer inside the validation object.
        return (this.validResponse && this.validResponse.score) || 0;
    }

    /**
     * Check if the current question is scorable or not.
     * For example:
     * - If there is no valid response data set in the question, this method should return false
     * - If this question type is not scorable (like an essay or open ended question) then this will return false
     * @returns {boolean}
     */
    canValidateResponse() {
        // Scorable only when a valid response value has been configured in the validation object.
        return !!(this.validResponse && this.validResponse.value !== undefined);
    }
}
