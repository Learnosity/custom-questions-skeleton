/**
 * 
 * @param {boolean} correctAnswer - whether the answer was correct of not
 * @param {array} elements - array elements whose classnames we want to modify
 */
export const showValidationUI = (correctAnswer, elements) => {

    if (correctAnswer) {
        elements.forEach(element => {
            if(element.classList.contains('incorrect')) {
                element.classList.remove('incorrect')
            }
            element.classList.add('correct')
        })
    } else {
        elements.forEach(element => {
            if(element.classList.contains('correct')) {
                element.classList.remove('correct')
            }
            element.classList.add('incorrect')
        })
    }

}

export const clearValidationUI = (elements) => {
       elements.forEach(element => {
            element.classList.remove('correct')
            element.classList.remove('incorrect')
    })
}

export const disable = (elements) => {
    elements.forEach(element => {
        element.classList.add('disabled')
  })
}