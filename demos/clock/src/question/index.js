import { PREFIX } from "./constants";
import Clock from "./components/clock";
import * as d3 from "d3";
import { drag } from "d3-drag";
import {
    showValidationUI,
    clearValidationUI,
    disable,
} from "./utils/handleClasses";
import { updateHand } from "./utils/shapeDrawers";
import { roundAngle } from "./utils/roundAngle";
import { getPointOnCircle } from "./utils/pointFinders";
import { CLOCK_CENTER } from "./constants";


export default class ClockQuestion {
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
                facade.disable();
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
                    <div class="main-container">
                        <svg></svg>
                    </div>
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

            this.clock = new Clock(el.querySelector("svg"), {
                question,
                response,
            });

            this.clock.render();

            if (response) {
                updateHand(this.clock.minHand, response.minHandAngle);
                updateHand(this.clock.hourHand, response.hourHandAngle);
            }
        });
    }

    /**
     * Add public methods to the created question instance that is accessible during runtime
     *
     * Example: questionsApp.question('my-custom-question-response-id').myNewMethod();
     */
    registerPublicMethods() {
        const { init, clock, el } = this;
        // Attach the methods you want on this object
        const facade = init.getFacade();

        facade.disable = () => {
            disable([el.querySelector("svg")]);
            disable(el.querySelectorAll(".hand"));
        };
        facade.enable = () => {};
    }

    handleEvents() {
        const { events, init, el, clock } = this;
        const facade = init.getFacade();
        const face = el.querySelector(".face");
        const { state } = init;

        // setup drag for the clock hands:
        const dragHandler = drag()
            .on("start", () => {})
            .on("drag", function (event) {
                let rad = Math.atan2(
                    event.y - CLOCK_CENTER,
                    event.x - CLOCK_CENTER
                );

                let degrees = rad / (Math.PI / 180);
                
                if (degrees < 0) degrees = 360 + degrees;

                const hand = this;

                d3.select(hand)
                    .attr("x2", (d) => getPointOnCircle(d.radius, degrees).x)
                    .attr("y2", (d) => getPointOnCircle(d.radius, degrees).y)
                    .attr("data-angle", roundAngle(degrees));
            })
            .on("end", () => {
                let responseObject = {
                    minHandAngle: roundAngle(clock.minHand.attr("data-angle")),
                    hourHandAngle: roundAngle(
                        clock.hourHand.attr("data-angle")
                    ),
                };

                events.trigger("changed", responseObject);

                clearValidationUI([
                    el.querySelector(".lrn_response_input"),
                    face,
                ]);
            });

        if (state !== "review") {
            clock.minHand.call(dragHandler);
            clock.hourHand.call(dragHandler);
        }

        // TODO: Requires implementation - Make sure you trigger 'changed' event after users changes their responses

        // "validate" event can be triggered when Check Answer button is clicked or when public method .validate() is called
        // so developer needs to listen to this event to decide if he wants to display the correct answers to user or not
        // options.showCorrectAnswers will tell if correct answers for this question should be display or not.
        // The value showCorrectAnswers by default is the value of showCorrectAnswers inside initOptions object that is used
        // to initialize question app or the value of the options that is passed into public method validate (like question.validate({showCorrectAnswers: false}))

        events.on("validate", (options) => {
            clearValidationUI([
                el.querySelector(".lrn_response_input"),
                face,
            ]);
            const result = facade.isValid();

            // this targets the actual clock

            showValidationUI(result, [
                el.querySelector(".lrn_response_input"),
                face,
            ]);
        });
    }
}
