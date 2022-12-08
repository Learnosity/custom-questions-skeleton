import ClockQuestion from "./question/index";
import "../scss/main.scss";

/*global LearnosityAmd*/
LearnosityAmd.define([], function () {
    return {
        Question: ClockQuestion,
    };
});
