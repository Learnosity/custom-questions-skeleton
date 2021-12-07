import { get, isEqual, isNumber } from 'lodash';

export default class BoxAndWhiskerScorer {
    constructor(question, response) {
        this.question = question;
        this.response = response;
        this.validResponse = get(question, 'valid_response');
    }

    isValid() {
        const { response, validResponse } = this;

        return response
            && validResponse
            && isEqual(response.value, validResponse.value);
    }

    validateIndividualResponses() {
        const { response, validResponse } = this;
        const validResponseValue = validResponse.value || {};
        const responseValue = (response && response.value) || {};
        const partial = {};

        ['min', 'max', 'quartile_1', 'median', 'quartile_3'].forEach((key) => {
            partial[key] = isNumber(responseValue[key]) && responseValue[key] === validResponseValue[key];
        });

        return partial;
    }

    score() {
        return this.isValid() ? this.maxScore() : 0;
    }

    maxScore() {
        return this.question.score || 0;
    }

    canValidateResponse() {
        return !!(this.validResponse && this.validResponse.value);
    }
}
