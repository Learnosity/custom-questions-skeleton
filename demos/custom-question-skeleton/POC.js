/*global Learnosity Amd*/
LearnosityAmd.define([
    'underscore',
    'jquery-v1.10.2',
    'https://www.qualified.io/embed.js'
], function (
    _,
    $
) {
    'use strict';

    const embedClientKey = '1qn3++dTsk5FooeiaArwaip2+TmtOwvZ';

    function getValidResponse(question) {
        return (
            _.isObject(question) &&
            question.response
        ) || '';
    }

    function CustomQualified(init, lrnUtils) {
        this.init = init;
        this.lrnUtils = lrnUtils;
        this.question = init.question;
        this.response = init.response || {};
        this.$el = init.$el;

        this.setup(this.response);

        init.events.trigger('ready');
    }

    function loadQualified(init){
        var editorMode;
        var initialFiles;
        var initialCursor;
        var challengeId = init.question.challenge_id;
        var hideTabs;

        if (init.response) {
            console.log(init.response);
            initialFiles = init.response["files"];
            initialCursor = init.response["cursor"];
        }

        if (init.state == "review") {
            editorMode = "readonly";
            initialCursor = "";
            hideTabs = ["idesettings", "runnerframe"];
        }

        var manager = window.QualifiedEmbed.init({
            // generate editors by looking through nodes
            autoCreate: false,
            // shared options for new editors
            options: {
                embedClientKey: embedClientKey
            },
            // challenge-specific options
            challengeOptions: {
                [challengeId]: {
                    language: init.question.language,
                    theme: init.question.theme,
                    autoStart: false,
                    mode: editorMode,
                    initialFiles: initialFiles,
                    initialCursor: initialCursor,
                    hideActions: "attempt",
                    hideTabs: hideTabs,
                    availableTabs: [
                          "instructions",
                          "runnerframe",
                          "idesettings",
                          "code",
                          "testcases"
                      ]
                }
            },
            // The following events can also be handled per-challenge
            onLoaded({
                manager,
                editor,
                challengeId,
                data
            }) {
                // Respond to challenge being loaded
                console.log("challenge loaded: " + challengeId);
            },
            onChange({
                manager,
                editor,
                challengeId,
                data
            }) {
                // save changes made to the solution
                init.events.trigger('changed', data);
            },
            onRun({
                manager,
                editor,
                challengeId,
                data
            }) {
                console.log("challenge " + challengeId + " was run with this result:");
                console.log(data);
                var resultData = {
                    "files": data.fileData.files,
                    "cursor": data.fileData.cursor,
                    "result": data.result
                };

                init.events.trigger('changed', resultData);
            }
        });

        // get DOM element to embed Qualified editor
        var QualifiedDOMel = init.$el.find('[data-qualified-embed="' + challengeId + '"]').get(0);

        manager.createEditor({
            "node": QualifiedDOMel
        });

        return manager;
    }

    _.extend(CustomQualified.prototype, {
        render: function (challengeId) {
            this.$el
                .html('<div><div data-qualified-embed="' + challengeId + '"></div></div>');
        },

        setup: function (response) {
            var init = this.init;
            var events = init.events;
            var facade = init.getFacade();

            this.render(init.question.challenge_id);

            this.qualifiedMgr = loadQualified(init);

            //TODO: This needs to be implemented using Qualified methods
            // this.updatePublicMethods(facade);

            // "validate" event can be triggered when Check Answer button is clicked or when public method .validate() is called
            // so developer needs to listen to this event to decide if he wants to display the correct answers to user or not
            // options.showCorrectAnswers will tell if correct answers for this question should be display or not.
            // The value showCorrectAnswers by default is the value of showCorrectAnswers inside initOptions object that is used
            // to initialize question app or the value of the options that is passed into public method validate (like question.validate({showCorrectAnswers: false}))
            events.on('validate', function (options) {
                //Qualified doesn't support to run tests on read-only mode
                if(init.state != "review"){
                    this.qualifiedMgr.editors[0].runTests();
                }
            }.bind(this));
        },

        updatePublicMethods: function (facade) {
            var self = this;

            // Override mandatory public methods
            var _enable = facade.enable;
            facade.enable = function () {
                _enable();
                self.$response.prop('disabled', false);
            };

            var _disable = facade.disable;
            facade.disable = function () {
                _disable();
                self.$response.prop('disabled', true);
            };

            // Add new public methods
            facade.reset = function () {
                self.$response
                    .val('')
                    .trigger('changed');
            };
        }
    });

    function CustomQualifiedScorer(question, response) {
        this.question = question;
        this.response = response;
        this.validResponse = getValidResponse(question);
    }

    _.extend(CustomQualifiedScorer.prototype, {
        isValid: function () {
            return _.isObject(this.response)
        },

        score: function () {
            return (this.isValid() && this.response.result) ? Math.round(this.response.result.passed * this.maxScore() / (this.response.result.passed + this.response.result.failed)): 0;
        },

        maxScore: function () {
            return parseFloat(this.question.max_score) || 1;
        },

        canValidateResponse: function () {
            // return always true to be able to validate and run test editor
            return true;
        }
    });

    return {
        Question: CustomQualified,
        Scorer:   CustomQualifiedScorer
    };
});

