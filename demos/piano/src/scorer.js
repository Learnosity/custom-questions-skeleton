/*globals LearnosityAmd*/
import PianoScorer from "./scorer/index";

LearnosityAmd.define([], function () {
    return {
        Scorer: PianoScorer,
    };
});
