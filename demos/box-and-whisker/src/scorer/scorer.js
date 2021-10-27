export default class Scorer {
    constructor(question, response) {
        this.question = question;
        this.response = response;
        this.validResponse = getValidResponse(question);
    }

    isValid() {
        return this.response && this.response.value === this.validResponse.value;
    }

    score() {
        return this.isValid() ? this.maxScore() : 0;
    }

    maxScore() {
        return this.validResponse.score || 1;
    }

    canValidateResponse() {
        return !!this.validResponse;
    }
}
