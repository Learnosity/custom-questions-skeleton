// src/question/index.js
//
// Learnosity Custom Question: coding assessment using the Sphere Engine
// Problems WIDGET (JS SDK): https://docs.sphere-engine.com/problems/widget/integration
//
// Rewritten against the ACTUAL skeleton Question class shape (verified against
// the user's local demos/custom-question-skeleton/src/question/index.js):
//   - el comes from init.$el.get(0), not init.el
//   - render() returns a Promise; 'ready' is triggered after it resolves
//   - responses are saved via events.trigger('changed', data), not init.changed()
//   - public methods (disable/enable/resetResponse/showValidationUI/resetValidationUI)
//     are attached to init.getFacade()
//   - the 'validate' event drives validation UI, not a component-owned isValid()
//
// Response shape saved to Learnosity (via events.trigger('changed', ...)):
//   {
//     apiId: number | null,     // Sphere Engine submission id, used by scorer.js
//     language: number | null,  // Sphere Engine compiler/language id at time of submission
//     source: string | null,    // snapshot of the code that was submitted
//     lastKnownStatus: string | null, // e.g. "accepted" — best-effort, for instant UI feedback only;
//                                      // scorer.js re-verifies against the Problems API server-side
//     submittedAt: string | null
//   }
//
// Question JSON attributes expected (author-configured, static per question):
//   {
//     "valid_response": "",   // REQUIRED by Learnosity even though unused — omitting it
//                              // disables server-side scoring entirely, per Learnosity docs.
//     "customerId": "<fixed per Sphere Engine account, i.e. per Learnosity customer/tenant>",
//     "widgetHash": "<widget unique hash from client panel, varies per question/Problem>",
//     "theme": "light"         // optional
//   }
// Note: customerId is set once per tenant via that tenant's own
// question_type_templates.defaults (see authoring/custom_question_types_registration.js) —
// individual authors never type it in, since it never changes within one customer's account.
// This is NOT hardcoded here, because a single question.js build is shared
// across multiple customers, each with their own Sphere Engine customerId.
//
// Runtime / per-learner data (NOT authored into the question — passed by the
// host application at Questions API init time) is read via custom_widget_options:
//   custom_widget_options: {
//     sphere_coding_question: { userId: '<stable per-learner id>' }
//   }
// See https://help.learnosity.com/hc/en-us/articles/360000758817-Creating-Custom-Questions#advanced-use-cases

import { PREFIX } from './constants';

// Non-terminal Sphere Engine statuses — a submission still in one of these
// hasn't been judged yet, so it should never be treated as "incorrect".
const PENDING_STATUSES = ['waiting', 'compiling', 'executing', 'received'];

const CUSTOM_WIDGET_OPTIONS_KEY = 'sphere_coding_question';
const SDK_SCRIPT_ID = 'sphere-engine-jssdk';

function ensureSdkLoaded(customerId) {
  return new Promise((resolve) => {
    if (window.SE && typeof window.SE.ready === 'function') {
      window.SE.ready(resolve);
      return;
    }

    window.SE_BASE = `${customerId}.widgets.sphere-engine.com`;
    window.SE_HTTPS = true;
    window.SE = window.SE || [];

    window.SE.ready = function (f) {
      if (document.readyState !== 'loading' && document.readyState !== 'interactive') f();
      else window.addEventListener('load', f);
    };

    if (!document.getElementById(SDK_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SDK_SCRIPT_ID;
      script.src = `${window.SE_HTTPS ? 'https' : 'http'}://${window.SE_BASE}/static/sdk/sdk.min.js`;
      script.onload = () => window.SE.ready(resolve);
      document.body.appendChild(script);
    } else {
      window.SE.ready(resolve);
    }
  });
}

export default class Question {
  constructor(init, lrnUtils) {
    this.init = init;
    this.events = init.events;
    this.lrnUtils = lrnUtils;
    this.el = init.$el.get(0);
    this.meta = init.question || {};

    this.savedResponse = init.response || {
      apiId: null,
      language: null,
      source: null,
      lastKnownStatus: null,
      submittedAt: null,
    };

    this.render().then(() => {
      this.registerPublicMethods();
      this.handleEvents();

      if (init.state === 'review') {
        init.getFacade().disable();
        // Don't rely on Questions API auto-firing 'validate' for review state —
        // show the validation UI explicitly using the already-saved response.
        init.getFacade().showValidationUI();
      }
      // Note: resume intentionally does NOT auto-show validation UI — only
      // review does. Resuming restores the response/editor content, but
      // feedback should only reappear if the learner presses Check Answer
      // again, matching Learnosity's expected resume behavior.

      this.events.trigger('ready');
    });
  }

  render() {
    const { el, lrnUtils } = this;

    el.innerHTML = `
      <div class="${PREFIX} lrn-response-validation-wrapper">
        <div class="lrn_response_input">
          <div class="${PREFIX}status"></div>
          <div class="${PREFIX}widget-host"></div>
        </div>
        <div class="${PREFIX}checkAnswer-wrapper"></div>
      </div>
    `;

    this.statusEl = el.querySelector(`.${PREFIX}status`);
    this.widgetHostContainer = el.querySelector(`.${PREFIX}widget-host`);

    // Note: unlike simple-value question types, there's no meaningful "suggested
    // correct answer" to show for a coding problem, so we only render CheckAnswerButton.
    return lrnUtils
      .renderComponent('CheckAnswerButton', el.querySelector(`.${PREFIX}checkAnswer-wrapper`))
      .then(() => {
        this._renderWidgetOrSummary();
      });
  }

  _renderWidgetOrSummary() {
    if (this.init.state === 'review') {
      // The Sphere Engine widget has no documented read-only mode, so for review
      // state we just show what was submitted instead of embedding it live.
      this._renderReviewSummary();
      return;
    }
    this._initWidget();
  }

  _renderReviewSummary() {
    const { source, language, lastKnownStatus, apiId } = this.savedResponse;
    this.widgetHostContainer.innerHTML = `
      <pre class="${PREFIX}review-source">${this._escapeHtml(source || '(no submission)')}</pre>
      <div class="${PREFIX}review-meta">
        Language id: ${language ?? '—'} · Status: ${lastKnownStatus ?? 'unknown'} · Submission: ${apiId ?? '—'}
      </div>
    `;
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  _getCustomWidgetOptions() {
    // custom_widget_options is supplied by the HOST APPLICATION at
    // LearnosityApp.init() time, never authored into the Question JSON.
    // Only available here in question.js (browser), never in scorer.js.
    if (typeof this.init.getCustomWidgetOptions !== 'function') return {};
    try {
      return this.init.getCustomWidgetOptions(CUSTOM_WIDGET_OPTIONS_KEY) || {};
    } catch (err) {
      return {};
    }
  }

  async _initWidget() {
    if (!this.meta.customerId || !this.meta.widgetHash) {
      this._setStatus('Sphere Engine widget is not configured for this question.');
      return;
    }

    const widgetDomId = `${PREFIX}widget-${this.meta.response_id || Math.random().toString(36).slice(2)}`;
    const div = document.createElement('div');
    div.id = widgetDomId;
    div.className = 'se-widget';
    div.setAttribute('data-id', widgetDomId);
    div.setAttribute('data-widget', this.meta.widgetHash);
    if (this.meta.theme) div.setAttribute('data-theme', this.meta.theme);

    const widgetOptions = this._getCustomWidgetOptions();
    // Default the widget's own session scope to THIS Learnosity response, so a
    // fresh response_id (new attempt/session) never inherits another attempt's
    // code. Only override with a real per-learner id if you deliberately want
    // the widget to remember code across separate responses/devices for the
    // same learner (e.g. a persistent "coding sandbox" use case) — that's an
    // explicit choice, not the default.
    const userId = widgetOptions.userId || this.meta.response_id;
    if (userId) div.setAttribute('data-user-id', userId);
    if (widgetOptions.signature) div.setAttribute('data-signature', widgetOptions.signature);
    div.setAttribute('data-custom-data', `response_id=${this.meta.response_id || ''}`);

    this.widgetHostContainer.appendChild(div);

    await ensureSdkLoaded(this.meta.customerId);
    this.seWidget = window.SE.widget(widgetDomId);

    if (this.savedResponse.source && this.savedResponse.language) {
      this._onWidgetLoaded = () => {
        this.seWidget.loadSourceCode(this.savedResponse.language, this.savedResponse.source);
      };
      this.seWidget.events.subscribe('widgetLoaded', this._onWidgetLoaded);
    }

    this._onBeforeSend = (data) => {
      this._pendingSubmission = {
        source: data.submission.source,
        language: data.submission.language,
      };
      const facade = this.init.getFacade();
      if (facade.resetValidationUI) facade.resetValidationUI();
      return true;
    };

    this._onAfterSend = (data) => {
      this.savedResponse = {
        apiId: data.submission.apiId,
        language: this._pendingSubmission?.language ?? this.savedResponse.language,
        source: this._pendingSubmission?.source ?? this.savedResponse.source,
        lastKnownStatus: null,
        submittedAt: new Date().toISOString(),
      };
      this._pendingSubmission = null;

      this.events.trigger('changed', this.savedResponse);
      this._setStatus(`Submission received (id ${data.submission.apiId}). Waiting for result…`);
    };

    this._onCheckStatus = (data) => {
      // eslint-disable-next-line no-console
      console.log('[SphereQuestion] checkStatus', data.status); // TEMP: verify exact status string/shape
      this._setStatus(`Submission ${data.submission.apiId}: ${data.status.description}`);
      // Best-effort local status cache purely for instant UI feedback via
      // showValidationUI(); scorer.js independently re-verifies server-side.
      if (data.status && data.status.description) {
        this.savedResponse = {
          ...this.savedResponse,
          lastKnownStatus: data.status.description.toLowerCase(),
        };
        this.events.trigger('changed', this.savedResponse);
      }
    };

    this.seWidget.events.subscribe('beforeSendSubmission', this._onBeforeSend);
    this.seWidget.events.subscribe('afterSendSubmission', this._onAfterSend);
    this.seWidget.events.subscribe('checkStatus', this._onCheckStatus);
  }

  registerPublicMethods() {
    const { init, el } = this;
    const facade = init.getFacade();

    facade.disable = () => {
      if (this.seWidget) {
        // No documented "disable" on the widget itself; destroying it and
        // showing the static review summary is the practical equivalent.
        this.seWidget.destroy();
        this.seWidget = null;
      }
      this._renderReviewSummary();
    };

    facade.enable = () => {
      // Re-enabling after disable() isn't a supported flow for this question
      // (review state is terminal in normal assessment flows) — left as a stub.
    };

    facade.resetResponse = () => {
      this.savedResponse = {
        apiId: null,
        language: null,
        source: null,
        lastKnownStatus: null,
        submittedAt: null,
      };
      this.events.trigger('resetResponse');
      facade.resetValidationUI();
      if (this.seWidget) this.seWidget.setSource('');
    };

    facade.showValidationUI = () => {
      const wrapper = el.querySelector('.lrn_response_input');
      const { lastKnownStatus } = this.savedResponse;

      if (!lastKnownStatus || PENDING_STATUSES.includes(lastKnownStatus)) {
        // Still grading (or nothing submitted yet) — don't claim correct or
        // incorrect. Leave neutral and let the status line communicate state.
        wrapper.classList.remove('lrn_correct', 'lrn_incorrect');
        this._setStatus('Still grading — press Check Answer again in a moment.');
        return;
      }

      const isCorrect = lastKnownStatus === 'accepted';
      wrapper.classList.add(isCorrect ? 'lrn_correct' : 'lrn_incorrect');
    };

    facade.resetValidationUI = () => {
      const wrapper = el.querySelector('.lrn_response_input');
      wrapper.classList.remove('lrn_correct', 'lrn_incorrect');
    };
  }

  handleEvents() {
    const { events, init } = this;
    const facade = init.getFacade();

    events.on('validate', (options) => {
      facade.showValidationUI();
      // No "suggested answer" concept for a coding problem — nothing to show
      // even when options.showCorrectAnswers is true.
    });
  }

  _setStatus(text) {
    if (this.statusEl) this.statusEl.textContent = text;
  }
}