/**
 *
 * @param {boolean} correctAnswer _ whether the answer was correct of not
 * @param {array} elements _ array elements whose classnames we want to modify
 */
export const showValidationUI = (correctAnswer, elements) => {
    elements.forEach((element) => {
        correctAnswer
            ? element.classList.add('lrn_correct')
            : element.classList.add('lrn_incorrect');
    });
};

export const clearValidationUI = (elements) => {
    elements.forEach((element) => {
        element.classList.remove('lrn_correct');
        element.classList.remove('lrn_incorrect');
    });
};

export const disable = (elements) => {
    elements.forEach((element) => {
        element.classList.add('disabled');
    });
};
