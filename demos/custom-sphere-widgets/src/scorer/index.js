// src/scorer/index.js
//
// SIMPLIFIED POC VERSION — trusts the client-reported lastKnownStatus saved
// in the response, instead of independently verifying against Sphere Engine
// via a backend proxy. This is a deliberate shortcut for the POC:
//
//   PROS: no proxy/backend needed at all, purely synchronous (matches the
//         skeleton's own bare example exactly), removes the unverified
//         "does Learnosity await Promises from these methods?" question.
//   CONS: NOT SECURE. lastKnownStatus comes from the browser (question.js
//         captured it from Sphere Engine widget events and saved it as part
//         of the response). A student could tamper with it client-side
//         (dev tools) to fake a correct score without solving the problem.
//         Before this goes beyond a POC, revert to the proxy-based version
//         that independently re-fetches the verdict from Sphere Engine's
//         Problems API server-side (see git history / POC_STATUS.md).

const PENDING_STATUSES = ['waiting', 'compiling', 'executing', 'received'];

export default class Scorer {
  constructor(question, response) {
    this.question = question;
    this.response = response || {};
    this.maxScoreValue = (question && question.validation && question.validation.maxScore) || 1;
  }

  canValidateResponse() {
    return !!this.response.apiId;
  }

  isValid() {
    return this.response.lastKnownStatus === 'accepted';
  }

  validateIndividualResponses() {
    // No per-test-case breakdown available without querying Sphere Engine directly.
    return null;
  }

  score() {
    return this.isValid() ? this.maxScoreValue : 0;
  }

  maxScore() {
    return this.maxScoreValue;
  }
}