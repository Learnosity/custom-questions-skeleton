export default class PianoScorer {
    constructor(question, response) {
        this.question = question;
        this.response = response;
    }

    /**
     * Check if the current question's response is valid or not
     * (Required)
     * @returns {boolean}
     */
    isValid() {
        // TODO: Requires implementation
        if (this.response) {
            const response = this.response;
            const correct = this.question.valid_response.notes;

            if (
                Array.isArray(response.notes) &&
                response.notes.length === correct.length
            ) {
                /** need to make sure to split on _ */
                return correct.every((note) => {
                    if (response.notes.includes(note)) {
                        return true;
                    }
                    return false;
                });
            }
            return false;
        }
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
        return this.isValid() ? this.question.max_score : 0;
    }

    /**
     * Returns the possible max score of the stored response
     * @returns {number}
     */
    maxScore() {
        return this.question.max_score;
    }

    /**
     * Check if the current question is scorable or not.
     * For example:
     * - If there is no valid response data set in the question, this method should return false
     * - If this question type is not scorable (like an essay or open ended question) then this will return false
     * @returns {boolean}
     */
    canValidateResponse() {
        if (
             this.response && 
             typeof this.response === "object" &&
             Object.keys(this.response).length === 0
         ) {
            return false;
        }
        return true;
    }
}
