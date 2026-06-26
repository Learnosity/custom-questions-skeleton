import { PREFIX } from './constants';

export default class UnitConverterQuestion {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        // Track the current question after each dynamicContent:changed event.
        // init.question is only the question at construction time.
        this.currentQuestion = init.question;

        this.render().then(() => {
            this.registerPublicMethods();
            this.handleEvents();
            this.handleDynamicContentChanges();

            if (init.state === 'review') {
                init.getFacade().disable();
            }

            init.events.trigger('ready');
        });
    }

    render() {
        const { el, lrnUtils } = this;
        const { question, response } = this.init;

        el.innerHTML = `
            <div class="${PREFIX} lrn-response-validation-wrapper">
                <div class="lrn_response_input">
                    <div class="${PREFIX}__card">
                        <div class="${PREFIX}__from">
                            <span class="${PREFIX}__from-value"></span>
                            <span class="${PREFIX}__from-unit"></span>
                        </div>
                        <div class="${PREFIX}__arrow">&#8594;</div>
                        <div class="${PREFIX}__to">
                            <input
                                type="number"
                                class="${PREFIX}__input"
                                placeholder="?"
                                step="any"
                                autocomplete="off"
                            />
                            <span class="${PREFIX}__to-unit"></span>
                        </div>
                    </div>
                </div>
                <div class="${PREFIX}__checkAnswer-wrapper"></div>
                <div class="${PREFIX}__suggestedAnswers-wrapper"></div>
            </div>
        `;

        return Promise.all([
            lrnUtils.renderComponent('SuggestedAnswersList', el.querySelector(`.${PREFIX}__suggestedAnswers-wrapper`)),
            lrnUtils.renderComponent('CheckAnswerButton', el.querySelector(`.${PREFIX}__checkAnswer-wrapper`))
        ]).then(([suggestedAnswersList]) => {
            this.suggestedAnswersList = suggestedAnswersList;

            // init.question is already resolved for the first (or stored) dynamic row.
            // init.response is the stored response value, if any (resume state).
            this.renderCard(question, response);
        });
    }

    /**
     * Update the converter card with the resolved question data and restore any
     * previously stored response for this attempt.
     *
     * Called both on initial render (via render()) and on every subsequent
     * dynamicContent:changed event.
     *
     * The platform has already substituted all {{var:x}} placeholders in the
     * question JSON before this method is called — our job is purely to update
     * the DOM from the resolved values.
     *
     * @param {object} question - Resolved question JSON for this attempt.
     *                            Includes fromValue, fromUnit, toUnit already substituted.
     * @param {string|null} response - Previously stored response value, or null.
     */
    renderCard(question, response) {
        const { el } = this;

        this.currentQuestion = question;

        el.querySelector(`.${PREFIX}__from-value`).textContent = question.fromValue;
        el.querySelector(`.${PREFIX}__from-unit`).textContent  = question.fromUnit;
        el.querySelector(`.${PREFIX}__to-unit`).textContent    = question.toUnit;

        const input = el.querySelector(`.${PREFIX}__input`);
        input.value = (response !== null && response !== undefined) ? response : '';

        this.clearValidationUI();
    }

    /**
     * KEY IMPLEMENTATION: handle the dynamicContent:changed facade event.
     *
     * When the host page calls facade.dynamic.nextAttempt() or previousAttempt(),
     * the platform fires 'dynamicContent:changed' on the public facade with:
     *   { question, response, rowId }
     *
     *   - question : resolved question JSON for the new attempt ({{var:x}} already
     *                substituted). Contains fromValue, fromUnit, toUnit ready to render.
     *   - response : previously stored response value for this attempt, or null.
     *   - rowId    : row identifier, e.g. "id_1".
     *
     * The platform does NOT re-render this widget — that is entirely our responsibility.
     * If we skip this handler, the card will display stale data from the previous
     * attempt even though the platform has moved on internally.
     *
     * IMPORTANT: use event.question for the resolved values.
     * Do NOT call facade.getQuestion() here — it returns the original template
     * with {{var:x}} placeholders intact, not the resolved values.
     */
    handleDynamicContentChanges() {
        const facade = this.init.getFacade();

        facade.on('dynamicContent:changed', ({ question, response }) => {
            this.renderCard(question, response);

            if (this.init.state === 'review') {
                this.renderValidationUI();
            }
        });
    }

    registerPublicMethods() {
        const { init } = this;
        const facade = init.getFacade();

        facade.disable = () => {
            const input = this.el.querySelector(`.${PREFIX}__input`);
            if (input) {
                input.setAttribute('disabled', true);
            }
        };

        facade.enable = () => {
            const input = this.el.querySelector(`.${PREFIX}__input`);
            if (input) {
                input.removeAttribute('disabled');
            }
        };

        facade.resetResponse = () => {
            const input = this.el.querySelector(`.${PREFIX}__input`);
            if (input) {
                input.value = '';
            }
            this.events.trigger('resetResponse');
            this.clearValidationUI();
        };
    }

    handleEvents() {
        const { el, events, init } = this;
        const facade = init.getFacade();
        const input = el.querySelector(`.${PREFIX}__input`);

        // Notify the platform whenever the student changes their answer.
        input.addEventListener('input', () => {
            this.clearValidationUI();
            events.trigger('changed', input.value);
        });

        // 'validate' fires when Check Answer is clicked or facade.validate() is called.
        events.on('validate', options => {
            // cache the showCorrectAnswers value for use in renderValidationUI()
            this._showCorrectAnswers = options.showCorrectAnswers;
            this.renderValidationUI();
        });
    }

    renderValidationUI() {
        const { el, events, init } = this;
        const facade = init.getFacade();
        const isValid = facade.isValid();
        const responseInputEl = el.querySelector('.lrn_response_input');
        const shouldShowCorrectAnswers = this._showCorrectAnswers;

        responseInputEl.classList.remove(`${PREFIX}--correct`, `${PREFIX}--incorrect`);
        responseInputEl.classList.add(isValid ? `${PREFIX}--correct` : `${PREFIX}--incorrect`);

        if (!isValid && shouldShowCorrectAnswers && this.suggestedAnswersList) {
            const validValue =
                this.currentQuestion.validation &&
                this.currentQuestion.validation.valid_response &&
                this.currentQuestion.validation.valid_response.value;

            if (validValue !== undefined) {
                this.suggestedAnswersList.setAnswers(
                    `${validValue} ${this.currentQuestion.toUnit}`
                );
            }
        }
    }

    clearValidationUI() {
        const responseInputEl = this.el.querySelector('.lrn_response_input');
        if (responseInputEl) {
            responseInputEl.classList.remove(
                `${PREFIX}--correct`,
                `${PREFIX}--incorrect`
            );
        }
        if (this.suggestedAnswersList) {
            this.suggestedAnswersList.reset();
        }
    }
}
