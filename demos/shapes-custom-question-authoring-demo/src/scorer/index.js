
export default class Scorer {
    constructor(question, response) {
        this.question = question;
        this.response = response;
    }

    isValid() {
        const { question, response } = this;

        let isValid = false;

        const hasAltResponses = question.validation.alt_responses && Array.isArray(question.validation.alt_responses) && question.validation.alt_responses.length > 0;

        if (!hasAltResponses) {
            isValid = response === question.validation.valid_response.value;
        } else {
            if(response === question.validation.valid_response.value) {
                isValid = true;
            } else {
               isValid =  question.validation.alt_responses.map(alt => alt.value).includes(response);
            }
        }

        return isValid;
    }

    validateIndividualResponses() {
        return null;
    }

    score() {
        const { question, response } = this;

        if(!this.isValid()) {
            return 0;
        } else {
            const allValidResponses = [question.validation.valid_response].concat(question.validation.alt_responses);
            return allValidResponses.find(correctResponse => correctResponse.value === response).score;
        }
    }

    maxScore() {
        return this.question.validation.valid_response.score || 0;
    }

    canValidateResponse() {
        return !!(this.question.validation.valid_response && this.question.validation.valid_response.value);
    }
}
