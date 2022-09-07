// stores the notes only from each note coorindate for the purposes of scoring/validation
export const notesOnly = (arr) => {
    return arr.map((str) => {
        const idx = str.indexOf("_");
        return str.substring(0, idx);
    });
};
// stores the indecides only from each note coordinate for the purposes of updating exactly which key pressed in resume and review modes
export const indeciesOnly = (arr) => {
    return arr.map((str) => {
        const idx = str.indexOf("_") + 1;
        return Number(str.substring(idx, str.length));
    });
};
// rebuild note coordinates from the former 2 functions for the purpose of updating respones with saved responses in resume mode
export const updateNoteCoordinatesArrayFromResponseObject = (obj, arr) => {
    if (obj.notes && obj.indecies) {
        obj.notes.forEach((note, idx) => {
            const noteIndex = obj.indecies[idx];
            const noteCoordinate = `${note}_${noteIndex}`;
            arr.push(noteCoordinate);
        });
        return arr;
    }
};
// sort the correct answer note coordinates in order of the keyboard even if played in different orders by the author of a question.
// this way they correctAnswers list will always show in order with the keyboard
// e.g. if someone authors pressing "E, G, C" for a C chord
// the correct answers lists will still show "C, E, G" (in order ascending on the piano, and which reflects //// how musicians typically spell chords)
export const sortNotes = (arr) => {
    return arr
        .sort((a, b) => {
            const splitIndex = a.indexOf("_") + 1;
            const firstNoteIndex = Number(a.substring(splitIndex, a.length));
            const nextNoteIndex = Number(b.substring(splitIndex, b.length));
            if (firstNoteIndex < nextNoteIndex) {
                return -1;
            }
        })
        .map((item) => item.substring(0, item.indexOf("_")));
};

// map the correct notes array to suggested answers list
export const handleAnswersList = (arr) => {
    return arr.map((note) => {
        return { label: note };
    });
};

// functions to handle validation UI classes

/**
 *
 * @param {boolean} correctAnswer _ whether the answer was correct of not
 * @param {array} elements _ array elements whose classnames we want to modify
 */
export const showValidationUI = (correctAnswer, elements) => {
    elements.forEach((element) => {
        correctAnswer
            ? element.classList.add("lrn_correct")
            : element.classList.add("lrn_incorrect");
    });
};

export const clearValidationUI = (elements) => {
    elements.forEach((element) => {
        element.classList.remove("lrn_correct");
        element.classList.remove("lrn_incorrect");
    });
};

export const disable = (elements) => {
    elements.forEach((element) => {
        element.classList.add("disabled");
    });
};
