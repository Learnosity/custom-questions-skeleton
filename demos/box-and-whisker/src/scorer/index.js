import { get, isEqual, isNumber } from 'lodash';

export default class BoxAndWhiskerScorer {
    constructor(question, response) {
        this.question = question;
        this.response = response;
        // The correct answer and its score live inside the question's `validation` object:
        //   validation.valid_response.value -> the correct answer { min, max, quartile_1, median, quartile_3 }
        //   validation.valid_response.score -> points awarded for a correct answer
        this.validResponse = get(question, 'validation.valid_response');
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
        return (this.validResponse && this.validResponse.score) || 0;
    }

    canValidateResponse() {
        return !!(this.validResponse && this.validResponse.value);
    }
}
