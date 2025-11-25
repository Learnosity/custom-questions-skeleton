/**
 * When creating a Learnosity Custom Question, it’s important to prefix the CSS class names being used inside
 * your custom Question UI.
 * You should avoid using a generic class name like `.btn`.
 * Instead, you should add a prefix to it like `.company-name-my-custom-question-btn`
 * to avoid CSS conflict with the host page and the CSS used by the Learnosity API.
 */
export const PREFIX = "lrn-shapes";

/**
 * @param {string} size
 * @returns {number} 
 */
export function mapSizeStringToFactor(size) {
    let factor;
    switch(size) {
        case "small":
            factor = 0.5;
        break;
        case "medium":
            factor = 1;
        break;
        case "large":
            factor = 1.5;
        break;
        case "xlarge":
            factor = 2;
        break;
        case "xxlarge":
            factor = 2.5;
        break;
        default:
            factor = 1;
    }
    return factor;
}

