
export default class Scorer {
    constructor(question, response) {
        this.question = question;
        this.response = response;
    }

    isValid() {
        const { question, response } = this;

        if (!question?.validation?.valid_response) {
            return false;
        }
        // Check primary valid response
        if (response === question.validation.valid_response.value) {
            return true;
        }
        // Check alternative responses
        if (question.validation.alt_responses?.length > 0) {
            return question.validation.alt_responses.some(alt => alt?.value === response);
        }
        return false;
    }

    validateIndividualResponses() {
        return null;
    }

    score() {
        const { question, response } = this;

        if (!this.isValid()) {
            return 0;
        } else {
            const validResponses = [
                question?.validation?.valid_response || {},
                ...(question?.validation?.alt_responses || [])
            ];
            const matchingResponse = validResponses.find(r => r?.value === response);
            return matchingResponse?.score ?? 0;
        }
    }

    maxScore() {
        return this.question?.validation.valid_response?.score || 0;
    }

    canValidateResponse() {
        return !!this.question?.validation?.valid_response?.value;
    }
}
