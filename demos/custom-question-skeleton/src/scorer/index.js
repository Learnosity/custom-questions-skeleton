export default class Scorer {
    constructor(question, response) {
        this.question = question;
        this.response = response?.runResult;
        console.log("scorer constructor response", this.response);
        console.log("scorer constructor question", this.question);
    }

    /**
     * Check if the current question's response is valid or not
     * (Required)
     * @returns {boolean}
     */
    isValid() {
        // TODO: Requires implementation

        console.log('Scorer.isValid', typeof this.response === "object")
        return typeof this.response === "object";
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
        console.log('Scorer.validateIndivid')
        return null;
    }

    /**
     * Returns the score of the stored response
     * @returns {number|null}
     */
    score() {
        // TODO: Requires implementation
        console.log('Scorer.score', this.response)
        if (!this.response) {
          return 0;
        }

        const totalTests = this.response.result.passed +
          this.response.result.failed;
        return this.isValid() && this.response.result
          ? (this.response.result.passed * this.maxScore()) / totalTests
          : 0;
    }

    /**
     * Returns the possible max score of the stored response
     * @returns {number}
     */
    maxScore() {
        // TODO: Requires implementation
        console.log('Scorer.maxScore')
        return parseFloat(this.question.max_score) || 1;
    }

    /**
     * Check if the current question is scorable or not.
     * For example:
     * - If there is no valid response data set in the question, this method should return false
     * - If this question type is not scorable (like an essay or open ended question) then this will return false
     * @returns {boolean}
     */
    canValidateResponse() {
        console.log('Scorer.canvalidaterespo', !!this.response)
        return true;
    }
}
