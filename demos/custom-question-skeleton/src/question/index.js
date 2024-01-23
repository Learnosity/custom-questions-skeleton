import { PREFIX } from "./constants";

export default class Question {
  constructor(init, lrnUtils) {
    this.init = init;
    this.events = init.events;
    this.lrnUtils = lrnUtils;
    this.el = init.$el.get(0);

    this.runResult = init.response?.runResult;
    this.latestCode = init.response?.latestCode;

    this.render()
      .then(() => {
        this.handleEvents();

        /**
         * @param { String } init.state - the state of Questions API.
         * state can be any of the following 3 strings
         * "initial" for first starting the assessment,
         * "resume" for coming back to a previously started assessment,
         * "review" for showing the completed assessment and results to the learner or teacher
         */
        if (init.state === "initial") {
          //
        } else if (init.state === "resume") {
          if (this.latestCode && this.editor) {
            this.editor.setFileContents(this.latestCode.files);
          }
        } else if (init.state === "review") {
          if (this.latestCode && this.editor) {
            this.editor.setFileContents(this.latestCode.files);
            this.attemptSubmission()
              .then(() => this.updateValidationUI());
          }

          init.getFacade().disable();
        }
      })
      .catch((err) => {
        console.error("Embed failed to load:", err);
      })
      .finally(() => {
        this.events.trigger("ready");
      });
  }

  render() {
    const { challengeId, embedClientKey, language } = this.init.question;
    const scriptSrc = "//www.qualified.io/embed.js";

    const renderError = (s) => {
      this.el.innerHTML = `
          <div class="alert alert-warning" role="alert">${s}</div>`;
      return Promise.resolve();
    };

    if (!embedClientKey?.trim()) {
      return renderError("Configuration issue: Missing embedClientKey");
    } else if (!challengeId?.trim()) {
      return renderError(`
          Please provide a Qualified Challenge ID (from the challenge's URL)
        `);
    } else if (!language?.trim()) {
      return renderError("Please provide a language");
    }

    let resolve;
    let reject;
    const embedLoaded = new Promise((resolve_, reject_) => {
      resolve = resolve_;
      reject = reject_;
    });
    const question = this;
    let firstOnChange = true;
    const timeout = setTimeout(() => {
      reject("Embed failed to load in 8 seconds");
    }, 8_000);
    const managerConfig = {
      options: {
        language,
        embedClientKey,
        mode: this.init.state === "review" ? "runonly" : null,
        hideActions: this.init.state === "review",
        hideTabs: [],
      },
      onLoaded({ manager, editor, challengeId, data }) {
        clearTimeout(timeout);
        resolve();
      },
      onChange({ manager, editor, challengeId, data }) {
        if (firstOnChange) {
          firstOnChange = false;
          return;
        }

        question.latestCode = data;
        question.saveToLearnosity();
      },
      onRun({ manager, editor, challengeId, data }) {
        if (data.type === "attempt") {
          question.runResult = data;
          question.saveToLearnosity();
        }
      },
    };

    if (window.QualifiedEmbed) {
      this.createEmbedEditor(managerConfig, challengeId);
      return embedLoaded;
    }

    const existingScript = document
      .querySelector(`script[src="${scriptSrc}"]`);

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        this.createEmbedEditor(managerConfig, challengeId);
      });
    } else {
      const script = document.createElement("script");
      script.addEventListener("load", () => {
        this.createEmbedEditor(managerConfig, challengeId);
      });
      script.src = scriptSrc;
      document.body.append(script);
    }

    return embedLoaded;
  }

  createEmbedEditor(managerConfig, challengeId) {
    this.el.innerHTML = `
      <div class="${PREFIX} lrn-response-validation-wrapper">
        <div class="lrn_response_input">
          <div class="qualified-embed"></div>
        </div>
      </div>`;
    const manager = window.QualifiedEmbed.init(managerConfig);
    const node = this.el.querySelector(".qualified-embed");
    this.editor = manager.createEditor({ node, challengeId });
    const frame = node.querySelector("iframe");
    frame.style.width = "100%";
    frame.style.height = "400px";
  }

  attemptSubmission({ tries, delayMs } = { tries: 10, delayMs: 1000 }) {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let done = false;
    let promise = Promise.resolve();

    for (let i = 0; i < tries; i++) {
      promise = promise
        .then(() => {
          if (!done) {
            return sleep(delayMs).then(() => this.editor.attempt());
          }
        })
        .then(() => {
          done = true;
        })
        .catch(() => {
          if (i >= tries - 1) {
            throw Error(`Runs failed on all of ${tries} tries`);
          }
        });
    }

    return promise;
  }

  saveToLearnosity() {
    this.events.trigger("changed", {
      runResult: this.runResult,
      latestCode: this.latestCode,
    });
  }

  updateValidationUI() {
    const score = this.init.getFacade().getScore();
    const el = this.el.querySelector(".lrn_response_input");
    el.classList.remove("lrn_incorrect", "lrn_correct");
    el.classList.add(
      score.score < score.max_score ? "lrn_incorrect" : "lrn_correct",
    );
  }

  handleEvents() {
    this.events.on("validate", (options) => {
      if (this.init.state !== "review") {
        this.updateValidationUI();
      }
    });
  }
}
