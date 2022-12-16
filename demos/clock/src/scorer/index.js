import { TOLERANCE } from "../question/constants";
export default class ClockScorer {
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
        if (this.response) {
            const { response, question } = this;
            const { valid_response } = question;
            const { hourHandAngle, minHandAngle } = response;
            // console.log("question.VALID_RESPONSE AT SCORER", valid_response);
            // console.log("RESPONSE AT SCORER", response);

            const correctHour = valid_response.hourHandAngle;
            const correctMin = valid_response.minHandAngle;
            // the acceptable range for the hand angles will be plus or minus 5 degrees, inclusive.
            // can adjust in constants.js later
            // might make the hour hand range a bit wider
            const lowestCorrectHour = correctHour - TOLERANCE;
            const highestCorrectHour = correctHour + TOLERANCE;
            const lowestCorrectMin = correctMin - TOLERANCE;
            const highestCorrectMin = correctMin + TOLERANCE;

            let hourHandInRange =
                hourHandAngle >= lowestCorrectHour &&
                hourHandAngle <= highestCorrectHour;

            let minHandInRange =
                minHandAngle >= lowestCorrectMin &&
                minHandAngle <= highestCorrectMin;

            // handle the edge case of 3 on the clock equaling 0 and 360
            const handle0 =
                (correctHour === 0 && correctMin === 0) ||
                correctHour === 0 ||
                correctMin === 0;
            const handle360 =
                (correctHour === 360 && correctMin === 360) ||
                correctHour === 360 ||
                correctMin === 360;
            if (handle0) {
                if (minHandAngle >= 360 - TOLERANCE) minHandInRange = true;
                if (hourHandAngle >= 360 - TOLERANCE) hourHandInRange = true;
            }
            if (handle360) {
                if (minHandAngle <= 0 + TOLERANCE) minHandInRange = true;
                if (hourHandAngle <= 0 + TOLERANCE) hourHandInRange = true;
            }

            // the return statement will evaluate to true if both are in range, otherwise false
            return hourHandInRange && minHandInRange;
        }

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
        return this.isValid() ? this.question.max_score : 0;
    }

    /**
     * Returns the possible max score of the stored response
     * @returns {number}
     */
    maxScore() {
        // TODO: Requires implementation
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
        // this function seems to have no bearing on preventing "check answer"
        // if the clock hands have not been moved, then check answer will do nothing
        return true;
    }
}
