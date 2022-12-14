import { PREFIX } from "./constants";
import PianoWidget from "./components/pianoWidget";
import { Synth } from "keithwhor-audiosynth-packaged";
import {
    notesOnly,
    indeciesOnly,
    updateNoteCoordinatesArrayFromResponseObject,
    sortNotes,
    handleAnswersList,
    showValidationUI,
    clearValidationUI,
    disable
} from "../utils.js";

export default class PianoQuestion {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        this.render().then(() => {
            this.registerPublicMethods();
            this.handleEvents();

            const facade = init.getFacade();

            if (init.state === "review") {
                facade.updateUI();
                facade.disable();
            }

            if (init.state === "resume") {
                facade.updateUI();
            }

            init.events.trigger("ready");
        });
    }

    render() {
        const { el, init, lrnUtils } = this;
        const { question, response } = init;

        // TODO: Requires implementation
        el.innerHTML = `
            <div class="${PREFIX} lrn-response-validation-wrapper">
                <div class="lrn_response_input">    
                    <div class="piano-widget"></div>       
                </div>            
                <div class="${PREFIX}-checkAnswer-wrapper"></div>
                <div class="${PREFIX}-suggestedAnswers-wrapper"></div>
            </div>
        `;

        // Optional - Render optional Learnosity components like Check Answer Button, Suggested Answers List
        // first before rendering your question's components
        return Promise.all([
            lrnUtils.renderComponent(
                "SuggestedAnswersList",
                el.querySelector(`.${PREFIX}-suggestedAnswers-wrapper`)
            ),
            lrnUtils.renderComponent(
                "CheckAnswerButton",
                el.querySelector(`.${PREFIX}-checkAnswer-wrapper`)
            ),
        ]).then(([suggestedAnswersList]) => {
            this.suggestedAnswersList = suggestedAnswersList;
            this.piano = new PianoWidget(
                el.querySelector(".piano-widget"),
                null,
                {
                    question,
                    response,
                }
            );
            // render the piano to the screen
            this.piano.render();
            // adjust synth volume to be 30% to avoid distortion
            Synth.setVolume(0.3);
        });
    }

    /**
     * Add public methods to the created question instance that is accessible during runtime
     *
     * Example: questionsApp.question('my-custom-question-response-id').myNewMethod();
     */
    registerPublicMethods() {
        const { init, el, piano } = this;
        // Attach the methods you want on this object
        const facade = init.getFacade();

        facade.disable = () => {
            disable([...facade.getKeys(), el.querySelector(".keyboard")]);
            piano.disabled = true;
        };
        facade.enable = () => {
            piano.disabled = false;
        };
        facade.updateUI = () => {
            const response = facade.getResponse();
            if (response && response.value.indecies) {
                const keys = facade.getKeys();

                const indecies = facade.getResponse().value.indecies;

                keys.forEach((key, idx) => {
                    if (indecies.includes(idx)) {
                        key.classList.toggle("selected");
                    }
                });
            }
        };
        facade.getKeys = () => {
            const keys = el.querySelectorAll(".key");
            return Array.from(keys);
        };
        facade.getSelectedKeys = () => {
            const keys = el.querySelectorAll(".selected");
            return Array.from(keys);
        };
    }

    handleEvents() {
        const { el, events, init, piano, suggestedAnswersList } = this;
        const facade = init.getFacade();
        const keys = facade.getKeys();

        let noteCoordinates = [];

        if (init.state === "resume") {
            const savedResponse = facade.getResponse();

            if (savedResponse) {
                updateNoteCoordinatesArrayFromResponseObject(
                    savedResponse.value,
                    noteCoordinates
                );
            }
        }

        for (let i = 0; i < piano.notes.length; i++) {
            let key = keys[i];
            let note = piano.notes[i];
            key.addEventListener("click", () => {
                if (init.state === "review") return;
                if (suggestedAnswersList) {
                    suggestedAnswersList.reset();
                }

                clearValidationUI([
                    ...facade.getSelectedKeys(),
                    el.querySelector(".lrn_response_input"),
                ]);

                i < 12
                    ? Synth.play("piano", note, 3, 2)
                    : Synth.play("piano", note, 4, 2);

                key.classList.toggle("selected");
                // save the index along with the note as noteCoordinate, so UI knows in which octave the note was pressed,
                // splittable on _
                // eg C_0 = first octave C, C_12 = second octave C, etc
                // the index is not part of the validation, it is only used to highlight the note in the correct octave
                // in resume and review modes

                let noteCoordinate = `${note}_${i}`;

                if (noteCoordinates.indexOf(noteCoordinate) === -1) {
                    noteCoordinates.push(noteCoordinate);
                } else {
                    noteCoordinates = noteCoordinates.filter(
                        (item) => item !== noteCoordinate
                    );
                }

                let responseObject = {
                    notes: notesOnly(noteCoordinates),
                    indecies: indeciesOnly(noteCoordinates),
                };

                events.trigger("changed", responseObject);
            });
        }

        this.events.on("validate", (options) => {
            const result = facade.isValid();

            showValidationUI(result, [
                ...facade.getSelectedKeys(),
                el.querySelector(".lrn_response_input"),
            ]);

            if (!result && options.showCorrectAnswers && suggestedAnswersList) {
                const validResponse = facade.getQuestion().valid_response;
                let validResponseNoteCorrdinates =
                    updateNoteCoordinatesArrayFromResponseObject(
                        validResponse,
                        []
                    );
                const notesInOrder = sortNotes(validResponseNoteCorrdinates);

                suggestedAnswersList.reset();
                suggestedAnswersList.setAnswers(
                    handleAnswersList(notesInOrder)
                );
            }
        });
    }
}
