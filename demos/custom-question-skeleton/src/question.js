import Question from './question/index';
import '../scss/main.scss';
import './custom.png'
import '../authoring_custom_layout.html'

/*global LearnosityAmd*/
LearnosityAmd.define([], function () {
    return {
        Question
    };
});
