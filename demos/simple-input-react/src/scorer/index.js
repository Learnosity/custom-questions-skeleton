import { get, isEqual } from "lodash";

export default class Scorer {
  constructor(question, responseValue) {
    this.question = question;
    this.responseValue = responseValue;
    this.validResponse = get(question, "valid_response");
  }

  checkTestCase(testCase) {
    try {
      // 1. Prepare the code
      // We append "; return functionName;" so we can extract the function handle
      // regardless of how the user defined it (var, const, or function keyword)
      const executableCode = `${this.responseValue}; return solution;`;

      // 2. Instantiate
      const createFunc = new Function(executableCode);
      const userFunc = createFunc();

      // 3. Prepare Arguments (Deep Copy to prevent mutation issues)
      const args = Object.keys(testCase.input).map((key) => {
        // Handle cases where the key might not exist in the object safely
        const val = testCase.input[key];
        return typeof val === "object" && val !== null
          ? JSON.parse(JSON.stringify(val))
          : val;
      });

      // 4. EXECUTE & CAPTURE RETURN VALUE
      // This is the key change: we store the result of the call
      const result = userFunc(...args);

      return {
        correct: result == testCase.output,
        // defines if the execution was successful or not
        success: true,
        result: result,
      };
    } catch (error) {
      return {
        correct: false,
        success: false,
        error: error.toString(), // e.g. "ReferenceError: maxSubArray is not defined"
      };
    }
  }

  /**
   * Check if the current question's response is valid or not
   * (Required)
   * @returns {boolean}
   */
  isValid() {
    const { responseValue, validResponse } = this;

    const results = this.question.test_cases.map((testCase) =>
      this.checkTestCase(testCase)
    );

    console.log(results);

    return results.every((result) => result.correct);
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
    return this.isValid();
  }

  /**
   * Returns the score of the stored response
   * @returns {number|null}
   */
  score() {
    return this.isValid() ? this.maxScore() : 0;
  }

  /**
   * Returns the possible max score of the stored response
   * @returns {number}
   */
  maxScore() {
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
    return !!this.validResponse;
  }
}
